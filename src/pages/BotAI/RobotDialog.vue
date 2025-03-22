<!-- RobotDialog.vue -->
<template>
  <teleport to="body">
<!--    <div class="dialog-overlay">-->
<!--      <div class="dialog-content">-->
<!--        <button class="close-btn" @click="$emit('close')">×</button>-->
<!--        <h2>{{ robot.name }} 详情</h2>-->
<!--        <div class="dialog-body">-->
<!--          &lt;!&ndash; 新增编辑表单 &ndash;&gt;-->
<!--          <div class="form-group">-->
<!--            <label>名称</label>-->
<!--            <input v-model="editForm.name">-->
<!--          </div>-->
<!--          <div class="form-group">-->
<!--            <label>功能</label>-->
<!--            <textarea v-model="editForm.function"></textarea>-->
<!--          </div>-->
<!--          <button class="save-btn" @click="handleSave">保存修改</button>-->

<!--          &lt;!&ndash; 新增详细信息 &ndash;&gt;-->
<!--          <div class="detail-grid">-->
<!--            <div>ID</div><div>{{ robot.id }}</div>-->
<!--            <div>创建时间</div><div>{{ formattedDate }}</div>-->
<!--            <div>当前状态</div><div>{{ robot.status }}</div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
    <iframe
        src="http://localhost/chatbot/sufcrmIuHGSq49Bw"
        style="width: 100%; height: 100%; min-height: 700px"
        allow="microphone">
    </iframe>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { reactive, watch } from 'vue';
import type { Robot } from './RobotDashboard.vue';

const props = defineProps<{
  robot: Robot
}>();

const emit = defineEmits(['update', 'close']);

// 新增编辑表单
const editForm = reactive({
  name: props.robot.name,
  function: props.robot.function
});

// 新增保存处理
const handleSave = () => {
  emit('update', {
    ...props.robot,
    ...editForm
  });
  emit('close');
};

// 监听机器人变化
watch(() => props.robot, (newVal) => {
  editForm.name = newVal.name;
  editForm.function = newVal.function;
});

const formattedDate = computed(() => {
  return props.robot.createdAt.toLocaleString();
});
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  min-width: 400px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

h2 {
  margin: 0 0 1.5rem;
  color: #222;
}

.dialog-body {
  line-height: 1.6;
}
.save-btn {
  background: #2196F3;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  margin: 1rem 0;
  cursor: pointer;
}

/* 新增详细信息网格 */
.detail-grid {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.detail-grid div:nth-child(odd) {
  font-weight: bold;
  color: #666;
}
</style>