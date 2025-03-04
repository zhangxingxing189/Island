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
        <label for="island">所属岛屿：</label>
        <select
            id="island"
            v-model="formData.island"
            required
            class="island-select"
        >
          <option
              v-for="island in islandList"
              :key="island.id"
              :value="island.name"
          >
            {{ island.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>封面图片：</label>
        <input
            type="file"
            accept="image/*"
            @change="handleCoverUpload"
            class="cover-upload"
        />
      </div>

      <div class="form-group">
        <label for="abstract">摘要：</label>
        <textarea
            id="abstract"
            v-model="formData.abstract"
            placeholder="请输入文章摘要（可选）"
            rows="3"
        ></textarea>
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
import { ref, onMounted } from "vue";
import { useAxios } from "@/api";
import { getIslandMessages } from "@/api/islandApi";

interface ArticleFormData {
  title: string;
  content: string;
  abstract?: string;
  cover?: string;
  island: string;
}

const formData = ref<ArticleFormData>({
  title: "",
  content: "",
  abstract: "",
  cover: "",
  island: ""
});

const islandList = ref<any[]>([]);

// 获取岛屿列表
onMounted(async () => {
  try {
    const data = await getIslandMessages();
    islandList.value = Object.values(data.islandMsg);
  } catch (error) {
    console.error("获取岛屿列表失败:", error);
  }
});

// 封面图片上传处理
const handleCoverUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    try {
      const uploadFormData = new FormData(); // 重命名避免命名冲突
      uploadFormData.append("file", file);

      const response = await useAxios.post<{
        data: { url: string } // 添加响应类型定义
      }>("/api/common/images", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      formData.value.cover = response.data.data.url;
    } catch (error) {
      console.error("封面上传失败:", error);
      alert("封面上传失败，请重试");
    }
  }
};


// 提交文章
const handleSubmit = async () => {
  try {
    const payload = {
      ...formData.value,
      abstract: formData.value.abstract || undefined // 处理可选字段
    };

    const response = await useAxios.post("/api/article", payload);

    if (response.data.code === 200) {
      alert("文章提交成功！");
      // 重置表单
      formData.value = {
        title: "",
        content: "",
        abstract: "",
        cover: "",
        island: ""
      };
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
.island-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.cover-upload {
  width: 100%;
  padding: 0.5rem;
  border: 1px dashed #ccc;
  border-radius: 4px;
}
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
