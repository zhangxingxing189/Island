<template>
  <div class="content-card" @click="handleClick">
    <div class="cover">
      <img :src="data.cover" :alt="data.title" />
    </div>
    <div class="content">
      <h3 class="title">{{ data.title }}</h3>
      <div class="meta">
        <div class="brief">{{ data.abstract || '暂无简介' }}</div>
      </div>
      <div class="stats">
        <button class="like-btn" @click.stop="handleLike">
          <i class="icon-like"></i>点赞 <i class="iconfont icon-dianzan"></i> {{ data.likes }}
        </button>
        <button
            class="collect-btn"
            :class="{ collected: isCollected }"
            @click.stop="handleCollect"
        >
          <i class="iconfont icon-shoucang"></i> {{ data.collect_count }}
        </button>
        <span class="comments">
<!--          <i class="icon-comment"></i> 浏览:{{ data.comments }}-->
          <span class="author">作者: {{ data.author }}</span>
        <span class="time">{{ data.timestamp }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, ref} from "vue";
import { useRouter } from "vue-router";
import { ContentItem } from "@/pages/blogPages/blogInterface";
import {collectArticle} from "@/api/articleApi";
import {ElMessage} from "element-plus";
const props = defineProps<{
  data: ContentItem;
}>();

const emit = defineEmits(["like"]);

const router = useRouter();
const handleClick = () => {
  router.push(`/island/article/${props.data.id}`);
}
const handleLike = () => {
  emit("like");
};
//收藏
const isCollected = ref(false);
const handleCollect = async () => {
  try {
    await collectArticle({ article_id: props.data.id });
    isCollected.value = !isCollected.value;
  } catch (error) {
    ElMessage.error('操作失败');
  }
};
</script>

<style scoped>
.collect-btn {
  color: var(--text-secondary);
  background: transparent;
  border: none;

  &.collected {
    color: var(--primary);
    .icon-shoucang {
      color: var(--primary);
    }
  }
}
.content-card {
  display: flex;
  margin-bottom: 16px;
  padding: 16px;
  background: white;
  border-radius: 4px;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .cover {
    width: 120px;
    height: 80px;
    margin-right: 16px;
    border-radius: 4px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .title {
    margin: 0 0 8px;
    font-size: 16px;
    color: #1a1a1a;
  }

  .meta {
    color: #666;
    font-size: 13px;
    margin-bottom: 8px;
  }

  .stats {
    display: flex;
    align-items: center;
    gap: 16px;

    .like-btn {
      color: #0084ff;
      cursor: pointer;
      background: none;
      border: none;

      &:hover {
        color: #0077e6;
      }
    }

    .comments {
      color: #8590a6;
      display: flex;
      align-items: center;
      gap: 20px;
    }
  }
}
</style>
