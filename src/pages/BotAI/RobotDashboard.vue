<!-- RobotDashboard.vue -->
<template>
  <Head></Head>
  <div class="dashboard">
    <button class="create-btn" @click="showCreateDialog = true">
      创建新机器人
    </button>

    <draggable
      v-model="store.robots"
      item-key="id"
      class="robot-list"
      @end="onDragEnd"
    >
      <template #item="{ element: robot }">
        <RobotCard
          :robot="robot"
          @delete="store.deleteRobot(robot.id)"
          @click="selectRobot(robot)"
          :class="{ selected: selectedRobot?.id === robot.id }"
        />
      </template>
    </draggable>

    <CreateRobotDialog
      v-if="showCreateDialog"
      @create="handleCreate"
      @close="showCreateDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { Robot, useBotStore } from "@/stores/botStore";
import Head from "@/pages/blogPages/index.vue";
import RobotCard from "./RobotCard.vue";
import CreateRobotDialog from "./CreateRobotDialog.vue";
import draggable from "vuedraggable";
import router from "@/router";

const store = useBotStore();
const { robots } = storeToRefs(store);
const showCreateDialog = ref(false);
const selectedRobot = ref<Robot | null>(null);

onMounted(() => {
  store.initLocalData();
});

const handleCreate = (newRobot: Omit<Robot, "id" | "createdAt" | "status">) => {
  store.createRobot(newRobot);
};

const selectRobot = (robot: Robot) => {
  selectedRobot.value = robot;
  router.push({
    path: "/bot/detail",
    query: { id: robot.id },
  });
};

const onDragEnd = () => {
  store.saveToLocal();
};
</script>

<style scoped>
.dashboard {
  position: relative; /* 添加定位上下文 */
  min-height: 100vh; /* 保证容器高度 */
  overflow: visible; /* 允许对话框溢出 */
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.create-btn {
  padding: 12px 24px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.create-btn:hover {
  background: #45a049;
}

.robot-list {
  margin-top: 2rem;
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.selected {
  border: 2px solid #2196f3 !important;
}
</style>
