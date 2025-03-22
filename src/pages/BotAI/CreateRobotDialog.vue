<!-- CreateRobotDialog.vue 修改后 -->
<template>
  <teleport to="body" id="createTeleport">
    <div class="dialog-overlay">
      <div class="dialog-content">
        <h2>🤖 创建新机器人</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>机器人名称</label>
            <input v-model="form.name" required placeholder="输入机器人名称" />
          </div>
          <div class="form-group">
            <label>功能描述</label>
            <textarea
              v-model="form.function"
              required
              placeholder="详细描述机器人功能"
              rows="3"
            ></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="$emit('close')">
              取消
            </button>
            <button type="submit" class="submit-btn">立即创建</button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { reactive } from "vue";

const form = reactive({
  name: "",
  function: "",
});

const emit = defineEmits(["create", "close"]);

const handleSubmit = () => {
  emit("create", form);
  emit("close");
  form.name = "";
  form.function = "";
};
</script>

<style scoped>
.dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-content {
  position: relative;
  z-index: 1000;
  margin: 20px;
  background: #f8f9fa;
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  max-width: 600px;
}
h2 {
  text-align: center;
  margin: 0 0 2rem;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
  background: white;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn {
  background: #f8f9fa;
  color: #718096;
  border: 2px solid #e2e8f0;
  flex: 1;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e0;
}

.submit-btn {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  flex: 1;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}
</style>
