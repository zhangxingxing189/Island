<template>
  <div id="image-upload">
    <input
      class="input-image"
      type="file"
      @change="handleFileChange"
      accept="image/*"
    />
    <!-- <div v-if="imageUrl" class="image-preview">
      <img :src="imageUrl" alt="Uploaded Image" />
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useAxios } from "@/api";

const imageUrl = ref<string | null>(null);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      imageUrl.value = e.target?.result as string;
      // 发送图片到服务器
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await useAxios.post("/api/common/images", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Upload success:", response.data);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    };
    reader.readAsDataURL(file);
  }
};
</script>

<style scoped>
#image-upload {
  width: 300px;
  position: relative;
  left: 50vw;
  top: 50vh;
  border: black 1px solid;
  border-radius: 10px;
  box-shadow: black 0 0 10px;
  background: rgba(255, 255, 255, 0.57);
  transform: translate(-50%, -50%);
}
.input-image {
  display: flex;
  width: 300px;
}
</style>
