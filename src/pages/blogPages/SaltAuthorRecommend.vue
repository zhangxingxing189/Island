<template>
  <div class="article-editor">
    <h1 class="editor-title">文章编辑</h1>
    <!-- 标题输入框 -->
    <label>标题</label>
    <input v-model="formData.title" type="text" class="input" placeholder="请输入文章标题" />

    <!-- 简介输入框 -->
    <div class="optional-field">
      <label>简介（可选）</label>
      <textarea
          v-model="formData.brief"
          class="input"
          placeholder="请输入文章简介，最多200字"
          rows="3"
          maxlength="200"
      ></textarea>
    </div>

    <!-- 分类选择框 -->
    <label>分类</label>
    <select v-model="formData.island" class="select">
      <option v-for="island in islandList" :key="island.id" :value="island.name">
        {{ island.name }}
      </option>
    </select>

    <!-- 封面上传 -->
    <label>封面</label>
    <div class="cover-upload" @click="triggerFileUpload">
      <img v-if="formData.cover" :src="formData.cover" class="cover-preview" />
      <span v-else>+</span>
    </div>
    <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleCoverUpload" />

    <!-- Markdown 富文本编辑器 -->
    <label>内容</label>
    <mavon-editor
        v-model="formData.content"
        :toolbars="markdownToolbars"
    />

    <!-- 提交按钮 -->
    <button class="submit-btn" @click="handleSubmit">提交文章</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { mavonEditor } from 'mavon-editor'
import "mavon-editor/dist/css/index.css";
import { useAxios } from "@/api";
import { getIslandMessages } from "@/api/islandApi";

const formData = ref({
  title: "",
  brief: "",
  content: "",
  cover: "",
  island: ""
});

const islandList = ref([]);

// 获取分类数据
onMounted(async () => {
  try {
    const data = await getIslandMessages();
    islandList.value = Object.values(data.islandMsg);
  } catch (error) {
    console.error("获取分类失败:", error);
  }
});

// 封面图片上传逻辑
const fileInput = ref(null);

const triggerFileUpload = () => {
  fileInput.value.click();
};

const handleCoverUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value.cover = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// 提交文章
const handleSubmit = async () => {
  try {
    const response = await useAxios.post("/api/article", formData.value);
    if (response.data.code === 200) {
      alert("文章提交成功！");
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("提交失败:", error);
    alert(`提交失败: ${error.message}`);
  }
};
</script>

<style scoped>

.editor-title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  color: #2d3748;
}
.article-editor {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.optional-field label {
  color: #718096;
  font-size: 0.9em;
}

optional-field textarea {
  resize: vertical;
  min-height: 80px;
}

.input, .select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}


.cover-upload {
  width: 120px;
  height: 120px;
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
}

.cover-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hidden {
  display: none;
}

.submit-btn {
  width: 100%;
  padding: 10px;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #3182ce;
}

</style>
