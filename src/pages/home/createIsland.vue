<template>
  <div class="create-island-container">
    <a-card title="创建新岛屿" style="width: 600px">
      <!-- 添加关闭图标 -->
      <template #extra>
        <close-outlined class="close-icon" @click="closeForm" />
      </template>
      <a-form
        :model="formState"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        @finish="handleSubmit"
      >
        <!-- 图片上传 -->
        <a-form-item
          label="岛屿图片"
          name="imageUrl"
          :rules="[{ required: true, message: '' }]"
        >
          <a-upload
            name="file"
            :custom-request="handleUpload"
            :show-upload-list="false"
            :before-upload="beforeUpload"
          >
            <div class="upload-area">
              <div v-if="formState.imageUrl" class="preview-container">
                <img
                  :src="formState.imageUrl"
                  alt="preview"
                  class="preview-image"
                />
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
          name="islandName"
          :rules="[{ required: true, message: '请输入岛屿名称' }]"
        >
          <a-input v-model:value="formState.islandName" />
        </a-form-item>

        <!-- 坐标 -->
        <div class="coordinate-inputs">
          <a-form-item
            label="X坐标"
            name="x"
            :rules="[
              { required: true, message: '请输入X坐标' },
              { type: 'number', message: '必须为数字' },
            ]"
          >
            <a-input-number
              v-model:value="formState.x"
              class="coordinate-input"
            />
          </a-form-item>
          <a-form-item
            label="Y坐标"
            name="y"
            :rules="[
              { required: true, message: '请输入Y坐标' },
              { type: 'number', message: '必须为数字' },
            ]"
          >
            <a-input-number
              v-model:value="formState.y"
              class="coordinate-input"
            />
          </a-form-item>
        </div>

        <a-form-item :wrapper-col="{ offset: 6, span: 16 }">
          <a-button
            type="primary"
            html-type="submit"
            :loading="submitting"
            class="submit-btn"
          >
            创建岛屿
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from "vue";
import { message, Upload } from "ant-design-vue";
import type { UploadProps } from "ant-design-vue";
import axios from "axios";
import { createIsland } from "@/api/islandApi";
import { checkLogin } from "@/pages/userPages/loginFunction";
import { post_image } from "@/api/image"; // 替换为你的API路径
// 新增图标引入
import { CloseOutlined, CloudUploadOutlined } from "@ant-design/icons-vue";

// 从UIFunction导入的变量需要确保是响应式对象（如使用ref）
import { isCreateIsland } from "@/pages/home/UIFunction";

// 关闭表单函数
const closeForm = () => {
  isCreateIsland.value = false; // 如果isCreateIsland是ref
  // 如果原变量是普通值，需要通过事件传递修改（推荐使用事件）
};
interface FormState {
  imageUrl: string;
  islandName: string;
  imageWidth: number | undefined;
  imageHeight: number | undefined;
  x: number | undefined;
  y: number | undefined;
}

const formState = reactive<FormState>({
  imageUrl: "",
  islandName: "",
  imageWidth: undefined,
  imageHeight: undefined,
  x: undefined,
  y: undefined,
});

const submitting = ref(false);

// 图片上传处理
const handleUpload: UploadProps["customRequest"] = async ({ file }) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await post_image(formData);
    console.log(response);
    if (response.code === 20000) {
      const img = new Image();
      img.src = response.data;

      await new Promise((resolve, reject) => {
        img.onload = () => {
          // 自动填充尺寸字段（保持number类型）
          formState.imageWidth = img.naturalWidth;
          formState.imageHeight = img.naturalHeight;
          resolve(true);
        };
        img.onerror = reject;
      });

      formState.imageUrl = response.data;
      console.log(formState.imageUrl);
      message.success("图片上传成功");
      await nextTick();
    } else {
      message.error("图片上传失败111");
      console.log(file);
      console.log(formData.values());
    }
  } catch (error) {
    message.error("图片上传失败");
    console.error("Upload error:", error);
  }
};

const beforeUpload: UploadProps["beforeUpload"] = (file) => {
  const isValid = ["image/jpeg", "image/png", "image/webp"].includes(file.type);

  if (!isValid) {
    message.error("仅支持JPG/PNG/WEBP格式");
    return Upload.LIST_IGNORE;
  }

  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error("图片大小不能超过5MB");
    return Upload.LIST_IGNORE;
  }

  return true;
};

const handleSubmit = async () => {
  // 新增尺寸验证
  if (!formState.imageWidth || !formState.imageHeight) {
    message.error("请先上传图片获取尺寸信息");
    return;
  }

  submitting.value = true;
  try {
    console.log(formState);
    await createIsland({
      ...formState,
      id: "0",
      imageWidth: Number(formState.imageWidth), // 保持转换
      imageHeight: Number(formState.imageHeight),
      x: Number(formState.x),
      y: Number(formState.y),
    });

    message.success("岛屿创建成功");
    // 重置时需要恢复undefined状态
    Object.assign(formState, {
      imageUrl: "",
      islandName: "",
      imageWidth: undefined,
      imageHeight: undefined,
      x: undefined,
      y: undefined,
    });
  } catch (error) {
    message.error("岛屿创建失败");
    console.error("Create island error:", error);
  } finally {
    submitting.value = false;
  }
};
// checkLogin(); //临时
</script>

<style scoped>
.create-island-container {
  top: 20%;
  right: 0;
  z-index: 9999;
  position: absolute;
  display: flex;
  justify-content: center;
}
/* 关闭图标样式 */
.close-icon {
  position: absolute;
  right: 24px;
  top: 16px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.45);
  cursor: pointer;
  transition: color 0.3s;
  z-index: 10000; /* 确保在最上层 */
}

.close-icon:hover {
  color: rgba(0, 0, 0, 0.85);
}

/* 调整卡片头部间距 */
:deep(.ant-card-head) {
  position: relative;
  padding-right: 40px; /* 给图标留出空间 */
}
.upload-area {
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #1890ff;
}

.preview-container {
  position: relative;
  width: 100%;
  height: 200px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

.reupload-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.preview-container:hover .reupload-mask {
  opacity: 1;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(0, 0, 0, 0.45);
}

.upload-text {
  margin-top: 8px;
}

.dimension-inputs,
.coordinate-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

:deep(.ant-input-number) {
  width: 100%;
}

.submit-btn {
  width: 100%;
  margin-top: 16px;
}
</style>
