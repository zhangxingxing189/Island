<template>
  <div class="island-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">Loading islands...</div>

    <!-- 错误提示 -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- 岛屿卡片列表 -->
    <div class="island-list">
      <div v-for="island in islands" :key="island.id" class="island-card">
        <div class="card-content">
          <!-- 岛屿图片 -->
          <img
            :src="island.path"
            :alt="island.name"
            class="island-image"
            :style="imageStyle(island)"
          />

          <!-- 岛屿信息 -->
          <div class="island-info">
            <h3 class="island-name">{{ island.name }}</h3>
            <div class="coordinates">
              <span>X: {{ island.xPoint }}</span>
              <span>Y: {{ island.yPoint }}</span>
            </div>
          </div>

          <!-- 删除按钮 -->
          <button
            class="delete-btn"
            @click="deleteIsland(island.id)"
            :disabled="deletingId === island.id"
          >
            {{ deletingId === island.id ? "Deleting..." : "×" }}
          </button>
          <!-- 在删除按钮旁边添加 -->
          <button
            class="edit-btn"
            @click="openEditForm(island)"
            :disabled="deletingId === island.id"
          >
            编辑
          </button>
        </div>
      </div>
    </div>
    <!-- 编辑弹窗 -->
    <!-- 在原有模板中添加 -->
    <a-card
      v-if="showEditForm"
      title="编辑岛屿"
      class="edit-modal"
      style="width: 600px"
    >
      <template #extra>
        <close-outlined class="close-icon" @click="showEditForm = false" />
      </template>
      <a-form
        :model="editForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        @finish="submitEdit"
      >
        <!-- 图片上传 -->
        <a-form-item
          label="岛屿图片"
          name="path"
          :rules="[{ required: true, message: '请上传图片' }]"
        >
          <a-upload
            name="file"
            :custom-request="handleEditUpload"
            :show-upload-list="false"
            :before-upload="beforeUpload"
          >
            <div class="upload-area">
              <div v-if="editForm.path" class="preview-container">
                <img :src="editForm.path" alt="preview" class="preview-image" />
                <div class="reupload-mask">
                  <span>重新上传</span>
                </div>
              </div>
              <div v-else class="upload-placeholder">
                <cloud-upload-outlined />
                <div class="upload-text">点击上传图片</div>
              </div>
            </div>
          </a-upload>
        </a-form-item>

        <!-- 岛屿名称 -->
        <a-form-item
          label="岛屿名称"
          name="name"
          :rules="[{ required: true, message: '请输入岛屿名称' }]"
        >
          <a-input v-model:value="editForm.name" />
        </a-form-item>

        <!-- 尺寸显示（只读） -->
        <div class="dimension-inputs">
          <a-form-item label="图片宽度">
            <a-input-number
              v-model:value="editForm.width"
              :disabled="true"
              class="coordinate-input"
            />
          </a-form-item>
          <a-form-item label="图片高度">
            <a-input-number
              v-model:value="editForm.height"
              :disabled="true"
              class="coordinate-input"
            />
          </a-form-item>
        </div>

        <!-- 坐标 -->
        <div class="coordinate-inputs">
          <a-form-item
            label="X坐标"
            name="xPoint"
            :rules="[
              { required: true, message: '请输入X坐标' },
              { type: 'number', message: '必须为数字' },
            ]"
          >
            <a-input-number
              v-model:value="editForm.xPoint"
              class="coordinate-input"
            />
          </a-form-item>
          <a-form-item
            label="Y坐标"
            name="yPoint"
            :rules="[
              { required: true, message: '请输入Y坐标' },
              { type: 'number', message: '必须为数字' },
            ]"
          >
            <a-input-number
              v-model:value="editForm.yPoint"
              class="coordinate-input"
            />
          </a-form-item>
        </div>

        <a-form-item :wrapper-col="{ offset: 6, span: 16 }">
          <a-button
            type="primary"
            html-type="submit"
            :loading="isSubmitting"
            class="submit-btn"
          >
            保存修改
          </a-button>
          <a-button style="margin-left: 10px" @click="showEditForm = false">
            取消
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { islandType, Island, putIsland } from "@/api/islandApi";
import { getIslands, delIsland } from "@/api/islandApi";
import { message, UploadProps } from "ant-design-vue";
import { post_image } from "@/api/image";

import { List } from "@/api/islandApi";

// 响应式数据
const islands = ref<List[]>([]);
const loading = ref(true);
const error = ref("");
const deletingId = ref<string | null>(null);

// 初始化加载数据
const loadIslands = async () => {
  try {
    islands.value = await getIslands();
  } catch (err) {
    error.value = "Failed to load islands";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// 图片尺寸样式
const imageStyle = (island: List) => ({
  width: `${island.width}px`,
  height: `${island.height}px`,
});

// 修改后的 deleteIsland 函数
const deleteIsland = async (id: string) => {
  try {
    deletingId.value = id; // 标记正在删除
    const res = await delIsland(id); // 调用删除接口

    // ✅ 仅当接口调用成功时移除卡片
    islands.value = islands.value.filter((i) => i.id !== id);
    message.success({
      content: `删除成功`,
      duration: 3, // 3秒后自动关闭
    });
    window.location.reload();
  } catch (err) {
    // ❌ 删除失败时保留卡片
    message.error({
      content: `删除失败: ${err.message || "请稍后重试"}`,
      duration: 3, // 3秒后自动关闭
    });
    console.error("删除操作失败:", err);
  } finally {
    deletingId.value = null; // 清除删除状态
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadIslands();
});

// 修改后的脚本部分
const showEditForm = ref(false);
const isSubmitting = ref(false);
const editForm = reactive<List>({
  id: "",
  path: "",
  name: "",
  width: 0,
  height: 0,
  xPoint: 0,
  yPoint: 0,
  userid: 0,
});

// 图片上传处理（复用创建逻辑稍作修改）
const handleEditUpload: UploadProps["customRequest"] = async ({ file }) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await post_image(formData);
    if (response.code === 20000) {
      const img = new Image();
      img.src = response.data;

      await new Promise((resolve, reject) => {
        img.onload = () => {
          editForm.width = img.naturalWidth;
          editForm.height = img.naturalHeight;
          resolve(true);
        };
        img.onerror = reject;
      });

      editForm.path = response.data;
      message.success("图片更新成功");
    }
  } catch (error) {
    message.error("图片上传失败");
  }
};

// 打开编辑表单时初始化数据
const openEditForm = (island: List) => {
  Object.assign(editForm, {
    id: island.id,
    path: island.path,
    name: island.name,
    width: island.width,
    height: island.height,
    xPoint: island.xPoint,
    yPoint: island.yPoint,
  });
  showEditForm.value = true;
};

// 提交修改
const submitEdit = async () => {
  try {
    isSubmitting.value = true;
    await putIsland(editForm);

    // 更新本地数据
    const index = islands.value.findIndex((i) => i.id === editForm.id);
    if (index !== -1) {
      islands.value[index] = {
        ...islands.value[index],
        ...editForm,
        path: editForm.path,
        name: editForm.name,
      };
    }
    message.success("修改成功");
    showEditForm.value = false;
    window.location.reload();
  } catch (error) {
    message.error(`修改失败:${error.message}`);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* 保持原有样式不变 */
.island-container {
  /* 原有样式 */
  top: 20%;
  right: 0;
  z-index: 9999;
  position: absolute;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  /* 新增样式 */
  background: white; /* 白色背景 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 可选添加阴影增加层次感 */
  max-height: 60vh; /* 最大高度为视口的60% */
  overflow-y: auto; /* 垂直方向超出显示滚动条 */

  /* 建议补充 */
  min-width: 30%; /* 确保容器宽度有效 */
  border-radius: 8px; /* 可选圆角 */
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #dc3545;
}

.island-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.island-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  overflow: hidden;
}

.island-card:hover {
  transform: translateY(-5px);
}

.card-content {
  position: relative;
}

.island-image {
  display: block;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
  background: #f5f5f5;
}

.island-info {
  padding: 1.5rem;
}

.island-name {
  margin: 0 0 0.5rem;
  color: #2c3e50;
  font-size: 1.25rem;
}

.coordinates {
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover:not(:disabled) {
  background: #dc3545;
  transform: scale(1.1);
}

.delete-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
/* 修改原有弹窗样式 */
.edit-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: white;
}

/* 移除原有modal-mask相关样式 */
.modal-wrapper {
  width: 100%;
  max-width: 500px;
}

.modal-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.button-group button {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button-group button[type="submit"] {
  background-color: #007bff;
  color: white;
}

.button-group button[type="button"] {
  background-color: #6c757d;
  color: white;
}
</style>
