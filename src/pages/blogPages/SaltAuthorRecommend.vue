<template>
  <div class="article-editor">
    <h1>文章编辑</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">标题：</label>
        <input
          type="text"
          id="title"
          v-model="formData.title"
          placeholder="请输入文章标题"
          required
        />
      </div>

      <div class="form-group">
        <label for="content">正文：</label>
        <textarea
          id="content"
          v-model="formData.content"
          placeholder="请输入文章内容"
          rows="15"
          required
        ></textarea>
      </div>

      <button type="submit" class="submit-btn">提交文章</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface ArticleFormData {
  title: string;
  content: string;
}

const formData = ref<ArticleFormData>({
  title: "",
  content: "",
});

const handleSubmit = () => {
  if (!formData.value.title.trim() || !formData.value.content.trim()) {
    alert("请填写完整内容");
    return;
  }

  // 这里可以添加提交到后端的逻辑
  console.log("提交内容：", formData.value);
  alert("文章提交成功！");

  // 清空表单
  formData.value = { title: "", content: "" };
};
</script>

<style scoped>
.article-editor {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4a5568;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus,
textarea:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

textarea {
  resize: vertical;
  min-height: 200px;
}

.submit-btn {
  display: block;
  width: 100%;
  padding: 1rem;
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

.submit-btn:active {
  background-color: #2b6cb0;
}
</style>
