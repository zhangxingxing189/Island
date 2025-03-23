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
import { useRoute } from "vue-router";
const route = useRoute();
const store = useBotStore();
const { robots } = storeToRefs(store);
const showCreateDialog = ref(false);
const selectedRobot = ref<Robot | null>(null);
const islandId = ref<string | null>(null);
islandId.value = Array.isArray(route.query.islandId)
  ? route.query.islandId[0]
  : route.query.islandId;
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
    query: { id: robot.id, islandId: islandId.value },
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
  overflow: auto; /* 允许对话框溢出 */
  padding: 2rem;
  max-width: 1200px;
  margin: 20px auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);
  border-radius: 10px;
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
