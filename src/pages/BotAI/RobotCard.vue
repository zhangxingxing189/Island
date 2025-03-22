<!-- RobotCard.vue -->
<template>
  <div class="robot-card">
    <!-- 新增删除按钮 -->
    <button class="delete-btn" @click.stop="$emit('delete', robot.id)">×</button>
    <div class="avatar">🤖</div>
    <h3>{{ robot.name }}</h3>
    <div class="info-grid">
      <div>功能</div>
      <div>{{ robot.function }}</div>
      <div>状态</div>
      <div :class="['status', robot.status?.toLowerCase()]">{{ robot.status }}</div>
    </div>
    <p>创建时间：{{ formattedDate }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Robot } from './RobotDashboard.vue';

const props = defineProps<{
  robot: Robot
}>();

const formattedDate = computed(() => {
  return props.robot.createdAt.toLocaleDateString();
});
</script>

<style scoped>
.robot-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 240px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.robot-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.avatar {
  font-size: 48px;
  margin-bottom: 1rem;
}

h3 {
  margin: 0 0 0.5rem;
  color: #333;
}

p {
  margin: 0;
  color: #666;
  font-size: 0.9em;
}
.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.robot-card:hover .delete-btn {
  opacity: 1;
}

/* 新增信息网格布局 */
.info-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  margin: 1rem 0;
  font-size: 0.9em;
}

.info-grid div:nth-child(odd) {
  font-weight: bold;
  color: #666;
}

/* 新增状态样式 */
.status {
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
}

.status.在线 {
  background: #4CAF50;
  color: white;
}

.status.离线 {
  background: #666;
  color: white;
}
</style>