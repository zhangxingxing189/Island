<template>
  <div class="article-editor">
    <!-- 退出按钮 -->
    <button class="back-btn" @click="handleBack">
      <img src="@/assets/images/退出.png" alt="退出" class="exit-icon" />
    </button>

    <h1 class="editor-title">文章编辑</h1>
    <!-- 标题输入框 -->
    <label>标题</label>
    <input
      v-model="formData.title"
      type="text"
      class="input"
      placeholder="请输入文章标题"
    />

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
      <option
        v-for="island in islandList"
        :key="island.id"
        :value="island.name"
      >
        {{ island.name }}
      </option>
    </select>

    <!-- 封面上传 -->
    <label>封面</label>
    <div class="cover-upload" @click="triggerFileUpload">
      <img v-if="formData.cover" :src="formData.cover" class="cover-preview" />
      <span v-else>+</span>
    </div>
    <input
      type="file"
      ref="fileInput"
      accept="image/*"
      class="hidden"
      @change="handleCoverUpload"
    />

    <!-- Markdown 富文本编辑器 -->
    <label>内容</label>
    <mavon-editor
        ref="mdEditor"
      v-model="formData.content"
      :toolbars="markdownToolbars"
        @imgAdd="handleImgAdd"
    />

    <!-- 提交按钮 -->
    <button class="submit-btn" @click="handleSubmit">提交文章</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import { useAxios } from "@/api";
import { getIslandMessages } from "@/api/islandApi";
import { useRouter } from "vue-router";
import { createArticle, getArticleList } from "@/api/articleApi";
import { message } from "ant-design-vue";
import { uploadImage } from "@/api/commonApi";
const formData = ref({
  title: "",
  brief: "",
  content: "",
  cover: "",
  island: "",
});

const islandList = ref([]);


// 获取分类数据
onMounted(async () => {
  try {
    const data = await getIslandMessages();
    console.log(data);
    islandList.value = Object.values(data.islandMsg).map((item: any) => ({
      id: item.id,
      name: item.islandName
    }));
  } catch (error) {
    console.error("获取分类失败:", error);
  }
});

// 封面图片上传逻辑
const fileInput = ref(null);

const triggerFileUpload = () => {
  fileInput.value.click();
};

const coverFile = ref<File | null>(null);  // 新增文件存储

const handleCoverUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    // 仅进行本地预览
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value.cover = e.target.result as string; // 临时使用本地URL
    };
    reader.readAsDataURL(file);
    coverFile.value = file; // 存储文件对象用于后续提交
  }
};

/*// 添加图片上传处理器
const handleEditorImageUpload = async (file, insertImage) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await useAxios.post("/api/common/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    insertImage(response.data.url);
  } catch (error) {
    console.error("图片上传失败:", error);
  }
};*/
const mdEditor = ref();

// 替换原有的handleEditorImageUpload方法
const handleImgAdd = async (pos: number, file: File) => {
  try {
    // 显示临时本地预览
    const blobUrl = URL.createObjectURL(file);
    mdEditor.value.$img2Url(pos, blobUrl); // 先显示本地预览

    // 异步上传到服务器
    const { data } = await uploadImage(file);
    console.log(data);
    // 用服务器URL替换临时URL
    mdEditor.value.$img2Url(pos, data.url);
    console.log(pos);
  } catch (error) {
    console.error("图片上传失败:", error);
    message.error("图片上传失败");
    // 上传失败时移除临时图片
    mdEditor.value.$imgDel(pos);
  }
};
// 提交方法
const handleSubmit = async () => {
  try {
    // 如果有封面文件，先上传
    if (coverFile.value) {
      const { data } = await uploadImage(coverFile.value);
      formData.value.cover = data; // 替换为服务器URL
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
       const res = await createArticle({
         title: formData.value.title,
         content: formData.value.content,
         abstract: formData.value.brief,
         cover: formData.value.cover,
         island: formData.value.island
       });
    console.log(res);
   message.success("文章创建成功");
    router.go(-1);
  } catch (error) {
    console.error("提交错误:", error);
    message.error("文章提交失败");
  } finally {
    coverFile.value = null; // 清除临时文件
  }
};

const router = useRouter();

const handleBack = () => {
  router.go(-1); // 返回上一页
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
  overflow-y: auto;
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

.optional-field textarea {
  resize: vertical;
  min-height: 80px;
}

.input,
.select {
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

.back-btn {
  position: absolute;
  left: 20px;
  top: 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #666;
  padding: 5px;
}

.back-btn:hover {
  color: #333;
}

.exit-icon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  transition: opacity 0.3s;
}

.back-btn:hover .exit-icon {
  opacity: 0.8;
}
</style>
