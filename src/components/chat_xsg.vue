<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="relative">
    <!-- 悬浮按钮 -->
    <button
        @click="toggleChat"
        class="fixed bottom-8 left-8 !rounded-button cursor-pointer flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 transition-all shadow-lg z-50"
        v-show="!isOpen"
    >
      <i class="fas fa-comments text-white text-xl"></i>
      <div
          v-if="unreadCount"
          class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
      >
        <span class="text-white text-xs">{{ unreadCount }}</span>
      </div>
    </button>

    <!-- 聊天窗口 -->
    <div
        v-show="isOpen"
        class="fixed left-0 bottom-0 w-screen h-screen bg-black bg-opacity-30 z-40"
        @click="toggleChat"
    >
      <div
          class="absolute left-0 bottom-0 w-[380px] h-[80vh] bg-white shadow-xl transition-transform transform"
          :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
          @click.stop
      >
        <!-- 顶部标题栏 -->
        <div
            class="h-14 border-b flex items-center justify-between px-4 bg-gray-50"
        >
          <h3 class="font-medium">聊天室</h3>
          <button @click="toggleChat" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- 频道选择 -->
        <div class="flex border-b">
          <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="currentTab = tab.id"
              class="flex-1 py-3 px-4 text-sm whitespace-nowrap cursor-pointer"
              :class="currentTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'"
          >
            {{ tab.name }}
          </button>
        </div>

        <!-- 消息列表 -->
        <div
            class="h-[calc(80vh-180px)] overflow-y-auto p-4"
            ref="messageContainer"
        >
          <div v-for="msg in currentMessages" :key="msg.id" class="mb-4">
            <div :class="msg.isSelf ? 'flex flex-row-reverse' : 'flex'">
              <div class="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0">
                <img
                    :src="msg.avatar"
                    class="w-full h-full rounded-full object-cover"
                    alt="avatar"
                />
              </div>
              <div :class="msg.isSelf ? 'mr-2 flex flex-col items-end' : 'ml-2'">
                <div class="text-xs text-gray-500 mb-1">{{ msg.user_name }}</div>
                <div
                    :class="msg.isSelf ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'"
                    class="px-4 py-2 rounded-lg max-w-[240px] break-words inline-block"
                >
                  {{ msg.message }}
                </div>
                <div class="text-xs text-gray-400 mt-1">{{ TimeFormatter(msg.timestamp) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
          <div class="flex items-center">
            <input
                v-model="messageInput"
                @keyup.enter="sendMessage"
                type="text"
                placeholder="输入消息..."
                class="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:border-blue-500"
            />
            <button
                @click="sendMessage"
                class="px-6 py-2 bg-blue-600 text-white !rounded-button rounded-l-none hover:bg-blue-700 whitespace-nowrap cursor-pointer"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, computed, onMounted, nextTick, onUnmounted} from "vue";
import {get_messages, send_message} from "@/api/chat";
import router from "@/router";
import {useRoute} from "vue-router";
import {get_island} from "@/api/questionApi";
import {useUserStore} from "@/stores/user";
import JSONbig from "json-bigint";
import {get_user_info} from "@/api/pkApi";

const route = useRoute()

const isOpen = ref(false);
const unreadCount = ref(0);
const currentTab = ref("announcement");
const messageInput = ref("");
const messageContainer = ref<HTMLElement | null>(null);

const tabs = [
  { id: "announcement", name: "公告频道" },
  { id: "circle", name: "圈子频道" },
];

interface Message {
  id: number;
  message: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  isSelf: boolean;
  avatar: string;
}

// 先获取用户信息
const userStore = useUserStore();
const currentUser = userStore.currentUser;

let myID = ref("");
onMounted(() => {
  // 获取自己的用户ID
  const tokenData = parseJWT(currentUser.atoken);
  if (tokenData) {
    console.log('用户ID:', tokenData.userid);
    myID.value = tokenData.userid;
  }
})

const parseJWT = (token: string) => {
  if (!token) return null;

  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));

    return JSONbig({ storeAsString: true }).parse(payload);
  } catch (error) {
    console.error('Token 解析失败:', error);
    return null;
  }
};

let UserName = new Map<string, string>();
let UserAvatar = new Map<string, string>();

// 读取公共消息
let timestamp_all = 0
let timestamp_island = 0
const isPollingActive = ref(true)

//是否第一次获取信息
let first_to_get_all = true
let first_to_get_island = true

const allPollMessages = async () => {
  const create_time = new Date().getTime();
  //console.log(create_time);
  while (isPollingActive.value) {
    try {
      const data = await get_messages({island_id: "0", timestamp: timestamp_all})
      // 处理接收到的消息
      //console.log('Received messages:', data)
      timestamp_all = data.data.timestamp+1
      if (data.data.length > 0) {
        //console.log(create_time,"正在运作!");
        for (const message of data.data.messages) {
          // 获取用户信息
          const user_info = await getUserInfo(message.user_id)
          const newMessage = {
            id: message.id,
            message: message.message,
            timestamp: message.timestamp,
            user_id: message.user_id,
            user_name: user_info?.username,
            isSelf: message.user_id === myID.value,
            avatar: user_info?.avatar,
          }
          AllMessages.value.push(newMessage)
          //console.log("AllMessages: ",AllMessages.value)
        }
        if (!isOpen.value && !first_to_get_all) {
          unreadCount.value+=data.data.length;
        } else {
          first_to_get_all = false;
        }
      }
    } catch (error) {
      console.log('Polling error:', error)
    }
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}

const islandPollMessages = async () => {
  const create_time = new Date().getTime();
  //console.log(create_time);
  while (isPollingActive.value) {
    try {
      const data = await get_messages({island_id: String(route.query.islandId), timestamp: timestamp_island})
      // 处理接收到的消息
      //console.log('Received messages:', data)
      timestamp_island = data.data.timestamp+1
      if (data.data.length > 0) {
        //console.log(create_time,"正在运作!");
        for (const message of data.data.messages) {
          // 获取用户信息
          const user_info = await getUserInfo(message.user_id)
          const newMessage = {
            id: message.id,
            message: message.message,
            timestamp: message.timestamp,
            user_id: message.user_id,
            user_name: user_info?.username,
            isSelf: message.user_id === myID.value,
            avatar: user_info?.avatar,
          }
          IslandMessages.value.push(newMessage)
          //console.log("AllMessages: ",IslandMessages.value)
        }
        if (!isOpen.value && !first_to_get_island) {
          unreadCount.value+=data.data.length;
        } else {
          first_to_get_island = false;
        }
      }
    } catch (error) {
      console.log('Polling error:', error)
    }
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}
const getUserInfo = async (user_id: string) => {
  // 判断MAP是否有该用户
  if (!UserName.has(user_id)) {
    // 异步获取用户信息
    try {
      const data = await get_user_info({user_id: user_id})
      UserName.set(user_id, data.data.username)
      UserAvatar.set(user_id, data.data.avatar)
    } catch (e) {
      console.log('获取用户信息失败:', e)
    }
  }
  return {username: UserName.get(user_id), avatar: UserAvatar.get(user_id)};
}

onMounted(() => {
  allPollMessages()
  islandPollMessages()
})

onUnmounted(() => {
  // 组件卸载时停止轮询
  isPollingActive.value = false
})

// 两个频道的消息列表
const AllMessages = ref<Message[]>([
]);

const IslandMessages = ref<Message[]>([
]);

const TimeFormatter = (timestamp: number): string => {
  const date = new Date(timestamp);

  if (isNaN(date.getTime())) return 'Invalid Date';

  // 补零函数
  const pad = (n: number) => n.toString().padStart(2, '0');

  // 获取时间组件
  const year = (date.getFullYear()).toString().slice(-2);
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
};

// 切换频道
const currentMessages = computed(() => {
  return currentTab.value === "announcement"
      ? AllMessages.value
      : IslandMessages.value;
});

// 切换聊天窗口
const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    unreadCount.value = 0;
    nextTick(() => {
      scrollToBottom();
    });
  }
};

// 滚动到底部
const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

// 发送消息
const sendMessage = async () => {
  if (!messageInput.value.trim()) return;

  if (currentTab.value === "announcement") {
    const data = await send_message({island_id: "0", message: messageInput.value});
  } else {
    const data = await send_message({island_id: String(route.query.islandId), message: messageInput.value});
  }

  messageInput.value = "";
};

// 监听路由变化
onMounted(() => {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen.value) {
      toggleChat();
    }
  });
});

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
