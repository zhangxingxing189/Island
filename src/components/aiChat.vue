<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from "vue";
import { CloseOutlined } from "@ant-design/icons-vue";

interface Message {
  id: number;
  content: string;
  isAI: boolean;
  timestamp: number;
  streaming?: boolean; // 新增流式状态
}

const STORAGE_KEY = "chat_history_v1";
const API_URL = "http://10.61.28.40:8080/api/ai/chat";

const isFold = ref(false);
const value = ref("");
const history = ref<Message[]>([]);
const sseEventSource = ref<EventSource | null>(null);
let messageId = 0;

// 加载历史记录
const loadHistory = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      if (Array.isArray(data)) {
        history.value = data;
        messageId = data.reduce((max, msg) => Math.max(max, msg.id), 0) + 1;
      }
    }
  } catch (e) {
    console.error("加载历史记录失败:", e);
  }
};
// 保存历史记录
const saveHistory = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value));
  } catch (e) {
    console.error("保存历史记录失败:", e);
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      alert("存储空间不足，部分消息可能无法保存");
    }
  }
};

// 流式响应处理
const handleStreamResponse = (question: string) => {
  return new Promise<void>((resolve) => {
    // 添加临时流式消息
    const tempMessage: Message = {
      id: messageId++,
      content: "",
      isAI: true,
      timestamp: Date.now(),
      streaming: true,
    };
    history.value = [...history.value, tempMessage];

    // 创建SSE连接
    const eventSource = new EventSource(
      `${API_URL}?content=${encodeURIComponent(question)}`
    );

    eventSource.onmessage = (event) => {
      const data = event.data;
      if (data === "[DONE]") {
        eventSource.close();
        resolve();
        return;
      }

      // 更新最后一条消息内容
      history.value = history.value.map((msg) => {
        if (msg.id === tempMessage.id) {
          return { ...msg, content: msg.content + data };
        }
        return msg;
      });
      scrollToBottom();
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      history.value = history.value.map((msg) => {
        if (msg.id === tempMessage.id) {
          return {
            ...msg,
            content: "服务暂时不可用，请稍后重试",
            streaming: false,
          };
        }
        return msg;
      });
      eventSource.close();
      resolve();
    };

    sseEventSource.value = eventSource;
  });
};

// 提交处理（修改后）
const handleSubmit = async () => {
  if (!value.value.trim() || history.value.some((m) => m.streaming)) return; //非空和非忙

  // 添加用户消息
  const userMsg: Message = {
    id: messageId++,
    content: value.value.trim(),
    isAI: false,
    timestamp: Date.now(),
  };
  history.value = [...history.value, userMsg];
  value.value = "";
  saveHistory();

  await nextTick();
  scrollToBottom();

  try {
    await handleStreamResponse(userMsg.content);
  } catch (error) {
    console.error("请求失败:", error);
  } finally {
    // 更新流式状态
    history.value = history.value.map((msg) => {
      if (msg.streaming) {
        return { ...msg, streaming: false };
      }
      return msg;
    });
    saveHistory();
  }
};
// 滚动控制
const scrollToBottom = () => {
  const container = document.querySelector(".chat-messages") as HTMLElement;
  if (container) {
    container.scrollTop = container.scrollHeight;
    container.scrollTo({ behavior: "smooth" });
  }
};

// 关闭聊天
const closeChat = () => {
  isFold.value = false;
  saveHistory();
};

onMounted(loadHistory);
onUnmounted(() => {
  sseEventSource.value?.close();
});
</script>

<template>
  <div
    :class="['fold', { unfold: isFold }]"
    @click="!isFold && (isFold = true)"
  >
    <div v-if="isFold" class="close-chat" @click.stop="closeChat">
      <CloseOutlined />
    </div>

    <div class="chat">
      <transition-group name="message" tag="div" class="chat-messages">
        <div
          v-for="msg in history"
          :key="msg.id"
          :class="[
            'message-bubble',
            {
              ai: msg.isAI,
              user: !msg.isAI,
              streaming: msg.streaming,
            },
          ]"
        >
          <div class="content">
            {{ msg.content }}
            <span v-if="msg.streaming" class="stream-cursor">|</span>
          </div>
          <div class="timestamp" v-if="!msg.streaming">
            {{ new Date(msg.timestamp).toLocaleTimeString() }}
          </div>
        </div>
      </transition-group>
    </div>

    <div v-if="isFold" class="input-container">
      <a-textarea
        v-model:value="value"
        class="input"
        placeholder="输入消息..."
        :auto-size="{ minRows: 1, maxRows: 3 }"
        @pressEnter="handleSubmit"
        :disabled="history.some((m) => m.streaming)"
      />
      <a-button
        type="primary"
        class="submit-btn"
        @click.stop="handleSubmit"
        :disabled="!value.trim() || history.some((m) => m.streaming)"
      >
        {{ history.some((m) => m.streaming) ? "发送中..." : "发送" }}
      </a-button>
    </div>
  </div>
</template>

<style scoped>
/* 使用嵌套CSS结构 */
.fold {
  z-index: 1;
  position: fixed;
  bottom: 5vh;
  right: 5vw;
  width: 80px;
  height: 80px;
  background-color: rgba(0, 255, 254, 0.44);
  border-radius: 50%;
  transition: all 0.5s ease;
  cursor: pointer;
  overflow: hidden; /* 新增 */

  /* 折叠状态隐藏内部元素 */
  .chat,
  .input-container {
    opacity: 0;
    width: 0;
    height: 0;
    transition: all 0.3s ease;
  }

  &.unfold {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 1%;
    height: 86vh;
    width: 25vw;
    background-color: rgb(255, 255, 255);
    border-radius: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

    .chat {
      opacity: 1;
      width: 90%;
      height: 75%;
      margin: 5% auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .chat-messages {
        height: 100%;
        padding: 15px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;

        .message-bubble {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 18px;
          position: relative;
          animation: messageIn 0.3s ease forwards;

          &.ai {
            background: #f0f2f5;
            align-self: flex-start;
            transform-origin: left bottom;
          }

          &.user {
            background: #1890ff;
            color: white;
            align-self: flex-end;
            transform-origin: right bottom;
          }

          .content {
            font-size: 14px;
            line-height: 1.5;
            word-break: break-word;
          }

          .timestamp {
            font-size: 10px;
            opacity: 0.7;
            margin-top: 4px;
          }
        }
      }
    }

    .input-container {
      opacity: 1;
      width: 90%;
      height: 20%;
      margin: 0 auto 10px;
      position: relative;

      /* 适配Ant Design组件 */
      :deep(.ant-input) {
        height: 100%;
        padding-right: 70px;
        border-radius: 20px;
        resize: none;
      }

      :deep(.ant-btn) {
        position: absolute;
        right: 8px;
        bottom: 8px;
        height: auto;
        padding: 6px 20px;
        border-radius: 18px;
      }
    }
  }

  .close-chat {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2;
    padding: 6px;
    color: rgba(255, 0, 0, 0.8);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.15);
      color: #ff0000;
    }
  }
}

@keyframes messageIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.message-enter-active {
  transition: all 0.3s ease;
}
.message-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.stream-cursor {
  animation: blink 1s infinite;
  opacity: 0.7;
  margin-left: 2px;
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

/* 流式消息样式 */
.message-bubble.streaming {
  background: rgba(240, 242, 245, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>
