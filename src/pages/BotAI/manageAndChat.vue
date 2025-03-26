<template>
  <a-layout class="main-containerAI">
    <!-- 左侧导航栏 -->
    <a-layout-sider class="nav-sider" :width="80">
      <div class="nav-content">
        <!-- 导航按钮 -->
        <div class="nav-buttons">
          <!-- 聊天按钮 -->
          <a-tooltip placement="right">
            <template #title>聊天界面</template>
            <div
              class="nav-icon-btn"
              :class="{ active: activeTab === 'chat' }"
              @click="activeTab = 'chat'"
            >
              <component
                :is="activeTab === 'chat' ? MessageFilled : MessageOutlined"
              />
            </div>
          </a-tooltip>

          <!-- 参数设置按钮 -->
          <a-tooltip placement="right">
            <template #title>参数设置</template>
            <div
              class="nav-icon-btn"
              :class="{ active: activeTab === 'settings' }"
              @click="activeTab = 'settings'"
            >
              <component
                :is="activeTab === 'settings' ? SettingFilled : SettingOutlined"
              />
            </div>
          </a-tooltip>
        </div>

        <!-- 用户头像 -->
        <div>
          <div class="user-avatar">
            <img
              :src="useUser?.currentUser?.avatar"
              alt="用户头像"
              class="avatar-img"
            />
          </div>
          <div class="icon-container" @click="handleClick">
            <HomeOutlined class="custom-icon" />
            <span class="icon-text">首页</span>
          </div>
        </div>
      </div>
    </a-layout-sider>

    <!-- 主内容区 -->
    <a-layout-content class="main-content">
      <div v-if="activeTab === 'chat'" class="chat-container">
        <iframe
          src="http://dify.islandlearning.icu:40800/chat/oJJN4gtC9EnVJdbe"
          class="chat-iframe"
          allow="microphone"
        />

        <!-- 右侧变量设置区 -->
        <a-layout-sider
          class="var-sider"
          collapsible
          v-model:collapsed="showVariables"
          :trigger="null"
        >
          <div class="var-panel">
            <a-card title="会话变量设置" :bordered="false">
              <a-form :model="variablesForm" layout="vertical">
                <a-form-item label="输入变量 (JSON格式)">
                  <a-textarea
                    v-model:value="variablesForm.jsonInput"
                    :rows="24"
                    placeholder='示例: {"name": "John", "age": 30}'
                    class="code-input"
                  />
                </a-form-item>

                <a-form-item>
                  <a-button
                    type="primary"
                    @click="submitVariables"
                    :loading="submitting"
                    block
                  >
                    <template #icon></template>
                    提交配置
                  </a-button>
                </a-form-item>
              </a-form>
            </a-card>
          </div>
        </a-layout-sider>
      </div>

      <!-- 机器人参数设置区 -->
      <div v-if="activeTab === 'settings'" class="settings-container">
        <a-card title="机器人参数配置" :bordered="false">
          <a-form :model="robotForm" layout="vertical">
            <!-- 不可变字段 -->
            <a-form-item label="机器人ID">
              <a-input v-model:value="robotForm.id" disabled />
            </a-form-item>

            <!-- 可编辑字段 -->
            <a-form-item label="机器人名称" required>
              <a-input v-model:value="robotForm.name" />
            </a-form-item>

            <a-form-item label="功能描述">
              <a-textarea v-model:value="robotForm.function" :rows="3" />
            </a-form-item>

            <!-- 不可变字段 -->
            <a-form-item label="状态">
              <a-input v-model:value="robotForm.status" disabled />
            </a-form-item>

            <a-form-item>
              <a-button
                type="primary"
                @click="saveRobotConfig"
                :loading="saving"
              >
                保存配置
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </div>
    </a-layout-content>
  </a-layout>
</template>
<script setup lang="ts">
import { ref, reactive, watch, onMounted, onBeforeUnmount } from "vue";
import { useSessionStore } from "@/stores/sessionStrore";
import {
  MessageFilled,
  MessageOutlined,
  SettingFilled,
  SettingOutlined,
} from "@ant-design/icons-vue";

import { message } from "ant-design-vue";
import { createLogger } from "vite";
// 1. 引入图标组件
import { HomeOutlined } from "@ant-design/icons-vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
import { useBotStore } from "@/stores/botStore";
import { useUserStore } from "@/stores/user";
const botStore = useBotStore();

const useUser = useUserStore();
const islandId = ref<string | null>(null);
islandId.value = Array.isArray(route.query.islandId)
  ? route.query.islandId[0]
  : route.query.islandId;
// 2. 点击事件处理
const handleClick = () => {
  console.log("图标被点击");
  router.push({
    path: "/bot",
    query: {
      islandId: islandId.value,
    },
  });
};
// 状态管理
const activeTab = ref<"chat" | "settings">("chat");
const saving = ref(false);

// 机器人参数表单
interface Robot {
  id: string;
  name: string;
  function?: string;
  createdAt: Date;
  status?: string;
}

const robotForm = reactive<Robot>({
  id: "",
  name: "我的聊天助手",
  function: "客户服务",
  createdAt: new Date(),
  status: "在线",
});

// 保存机器人配置
const saveRobotConfig = async () => {
  try {
    saving.value = true;

    // 仅提交允许修改的字段
    botStore.updateRobot(robotForm.id, {
      name: robotForm.name,
      function: robotForm.function,
    });

    message.success("配置保存成功");
  } catch (error) {
    message.error("保存失败");
  } finally {
    saving.value = false;
  }
};

// 状态管理
const showVariables = ref(true);
const submitting = ref(false);

// 变量表单
interface VariablesForm {
  jsonInput: string;
}
const sessionStore = useSessionStore();
const currentSessionId = ref("");

// 初始化变量表单
const variablesForm = reactive<VariablesForm>({
  jsonInput: "",
});

// 监听会话ID变化
watch(currentSessionId, (newId) => {
  if (newId) {
    const variables = sessionStore.getSessionVariables(newId);
    variablesForm.jsonInput = JSON.stringify(
      {
        directoryRule: variables.directoryRule,
        teacherRule: variables.teacherRule,
      },
      null,
      2
    );
  }
});

// 切换变量面板
const toggleVariables = () => {
  showVariables.value = !showVariables.value;
};

// 配置表单类型
interface ConfigForm {
  apiKey: string;
  userId: string;
  fileUrl: string;
  transferMethod: "remote_url" | "local_file";
}
// 初始化配置表单
const configForm = reactive<ConfigForm>({
  apiKey: "app-I6uSNfj4tC1ETUni7OzXim3Z", // 初始API密钥
  userId: "other", // 初始用户ID
  fileUrl: "https://cloud.dify.ai/logo/logo-site.png", // 默认文件URL
  transferMethod: "remote_url", // 默认传输方式
});
// 提交变量配置
const submitVariables = async () => {
  try {
    submitting.value = true;
    // 解析JSON输入
    // console.log(inputs);
    const inputs = JSON.parse(variablesForm.jsonInput);
    const parsed = JSON.parse(variablesForm.jsonInput);
    sessionStore.updateVariables(currentSessionId.value, parsed);
    // 构建请求数据
    const requestData = {
      inputs,
      query: "修改会话变量", // 可修改为动态查询
      response_mode: "blocking", // 改为阻塞模式
      user: configForm.userId,
      files: [
        {
          type: "image",
          transfer_method: configForm.transferMethod,
          url: configForm.fileUrl,
        },
      ],
    };
    console.log(requestData);
    // 发送请求
    // const response = await fetch('http://dify.islandlearning.icu/v1', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${configForm.apiKey}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(requestData)
    // });

    // // 检查响应状态
    // if (!response.ok) {
    //   throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    // }
    //
    // // 读取响应数据
    // const result = await response.json();
    // message.success('配置提交成功');
  } catch (error) {
    // 错误分类处理
    if (error instanceof SyntaxError) {
      message.error("JSON格式错误");
    } else if (error instanceof Error) {
      message.error(error.message);
    } else {
      message.error("未知错误");
    }
  } finally {
    submitting.value = false;
  }
};
// 在父页面保存会话ID
let currentConversationId = null;

// 监听iframe消息
window.addEventListener("message", (event) => {
  if (event.data.type === "SESSION_UPDATE") {
    currentConversationId = event.data.conversation_id;
    localStorage.setItem("dify_session", currentConversationId);
    console.log(currentConversationId);
  }
});
// 添加生命周期管理
const messageHandler = (event: MessageEvent) => {
  if (event.data.type === "SESSION_UPDATE") {
    currentSessionId.value = event.data.conversation_id;
    localStorage.setItem("dify_session", currentSessionId.value);
  }
};

onMounted(() => {
  message.info(
    "开始教学前需要上传书籍的pdf或者txt文件并且填写书名或者这次对话主题,若已上传文档则输入:开始教学,来开始教学活动,在学习过程中可以问问题,若已学会则输入:我学会了"
  );
  window.addEventListener("message", messageHandler);
  sessionStore.initFromLocal();
  currentSessionId.value = localStorage.getItem("dify_session") || "";
  // 从路由参数获取机器人ID
  const robotId = Array.isArray(route.query.id)
    ? route.query.id[0]
    : route.query.id || "";
  if (robotId) {
    // 获取机器人数据
    const robot = botStore.getRobot(robotId);
    if (robot) {
      Object.assign(robotForm, robot);
      currentSessionId.value = robotId; // 关联机器人ID和会话ID
    }
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("message", messageHandler);
});
</script>

<style lang="less" scoped>
.main-containerAI {
  height: 100vh;
  background: #f0f2f5;
  .ant-laout {
    color: #f0f2f5;
  }
}

.nav-sider {
  background: #fff !important;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.08);

  .nav-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 24px 0;
  }
}

.main-content {
  padding: 24px;
  background: #ffffff;
  box-shadow: inset 1px 0 2px rgba(0, 0, 0, 0.05);
}

.var-sider {
  max-width: 100%;
  min-width: 100%;
  width: 600px;
  margin-left: auto;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.05);

  .var-panel {
    padding: 16px;
    height: 100%;
  }
}

.chat-iframe {
  width: 90%;
  height: 100%;
  min-height: 500px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.nav-icon-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  color: #666;

  &:hover {
    background: #f0f2f5;
    color: #1890ff;
  }

  &.active {
    background: #1890ff;
    color: white;
  }
}

.user-avatar {
  padding: 16px;

  .avatar-img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid #eee;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.code-input {
  font-family: "Fira Code", monospace;
  border-radius: 6px;
  background: #fafafa;

  &:focus {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
}

.ant-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px !important;

  :deep(.ant-card-head) {
    border-bottom: 1px solid #f0f0f0;
  }
}
// 新增样式
.chat-container {
  display: flex;
  height: 100%;
}

.settings-container {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}
.icon-container {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  background-color: #f0f2f5;
  cursor: pointer;
  transition: all 0.3s ease;

  /* 悬停效果 */
  &:hover {
    background-color: #e6f7ff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    .custom-icon {
      color: #1890ff;
    }

    .icon-text {
      color: #1890ff;
    }
  }
}

/* 4. 图标样式 */
.custom-icon {
  font-size: 18px;
  margin-right: 8px;
  color: rgba(0, 0, 0, 0.85);
  transition: color 0.3s;
}

/* 5. 文本样式 */
.icon-text {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  transition: color 0.3s;
}
</style>
<style scoped>
/* 通过深度选择器穿透 scoped */
:deep(.var-sider.ant-layout-sider) {
  flex: 0 0 620px !important;
  max-width: 620px !important;
  min-width: 620px !important;
  width: 620px !important;
}
</style>
