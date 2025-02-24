<script setup lang="ts">
import { ContentItem } from "./blogInterface";
//测试数据
const newData: ContentItem = {
  id: 1,
  title: "New Article",
  cover: "new-cover.jpg",
  clickCount: 0,
  likes: 0,
  author: "New Author",
  authorID: 1,
  timestamp: "2023-09-15T12:00:00Z",
};
// 明确声明组件支持的事件
const emit = defineEmits(["create"]);

const handleCreate = () => {
  // 触发事件时使用定义好的名称
  emit("create", newData);
};
</script>

<template>
  这里是默认博客的文章区域,用于放技术blog,热榜按照点击数排序,关注是账号关注的人发的文章,仅支持点赞,收藏功能,正常来说应该从home页面进来,并且传参(传岛屿信息),但是图片放github上面访问不了(我看看这么搞),所以默认传了个岛屿信息
</template>

<style scoped></style>
