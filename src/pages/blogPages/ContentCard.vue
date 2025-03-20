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
        <button
            class="like-btn"
            :class="{ 'has-digged': isLiked }"
            @click.stop="handleLike"
        >
          <i class="iconfont icon-dianzan"></i> {{ localDiggCount }}
        </button>
        <button
            class="collect-btn"
            :class="{ collected: isCollected }"
            @click.stop="handleCollect"
        >
          <i class="iconfont icon-shoucang"></i> {{ localCollectCount  }}
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
import {defineProps, onMounted, ref} from "vue";
import { useRouter } from "vue-router";
import { ContentItem } from "@/pages/blogPages/blogInterface";
import {collectArticle, diggArticle, getOwnerCollectArticles, getOwnerDiggArticles} from "@/api/articleApi";
import {ElMessage} from "element-plus";
import {compileString} from "sass";
const props = defineProps<{
  data: ContentItem;
}>();
const emit = defineEmits(["like"]);

const router = useRouter();
const handleClick = () => {
  router.push(`/island/article/${props.data.id}`);
}

//收藏
const localCollectCount = ref(props.data.collect_count);
const isCollected = ref(false);
const collectedIds = ref<Set<string>>(new Set());

// 加载收藏状态
const loadCollectStatus = async () => {
  try {
    let page = 1;
    while (true) {
      const { data } = await getOwnerCollectArticles({ page });
      data.list.forEach(item => collectedIds.value.add(item.id));
      if(data.list.length < 10) break;
      page++;
    }
    isCollected.value = collectedIds.value.has(props.data.id);
    console.log(13124);
    console.log(isCollected);
  } catch (error) {
    console.error('加载收藏状态失败:', error);
  }
};

const handleCollect = async () => {
const originalStatus = isCollected.value;
try {
  // 立即更新本地状态
  isCollected.value = !isCollected.value;
  localCollectCount.value += isCollected.value ? 1 : -1;

  await collectArticle({ article_id: props.data.id });

  // 同步全局状态
  if (isCollected.value) {
    collectedIds.value.add(props.data.id);
  } else {
    collectedIds.value.delete(props.data.id);
  }
} catch (error) {
  // 操作失败时回滚状态
  isCollected.value = originalStatus;
  localCollectCount.value = Number(props.data.collect_count) || 0;
  ElMessage.error('操作失败');
}
};



const localDiggCount = ref(props.data.likes);
const isLiked = ref(false);  // 新增点赞状态

// 获取所有点赞文章
const loadLikeStatus = async () => {
  try {
    let page = 1;
    const tempIds = new Set();
    while (true) {
      const { data } = await getOwnerDiggArticles({
        page,
      });
      data.list.forEach(item => tempIds.add(item.id));
      if(data.list.length < 10) break;
      page++;
    }
    isLiked.value = tempIds.has(props.data.id);
  } catch (error) {
    console.error('加载失败:', error);
  }
};

// 修改点赞处理逻辑（约40行）
const handleLike = async () => {
  const originalStatus = isLiked.value;
  try {
    // 立即反馈
    isLiked.value = !isLiked.value;
    localDiggCount.value += isLiked.value ? 1 : -1;

    const { data: res } = await diggArticle({ article_id: props.data.id });

    // 同步全局状态
    if (res?.digg_count !== undefined) {
      localDiggCount.value = res.digg_count;
    }
  } catch (error) {
    // 回滚状态
    isLiked.value = originalStatus;
    localDiggCount.value = props.data.likes;
    console.error('操作失败');
  }
  emit("like");
};

// 初始化加载
onMounted(() => {
  loadLikeStatus();
  loadCollectStatus();
});
</script>
<style scoped>

.like-btn {
  color: #8590a6;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;

  &.has-digged {
    color: #2563eb;
  }

  &:hover {
    color: #2563eb;
  }
}
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


    .comments {
      color: #8590a6;
      display: flex;
      align-items: center;
      gap: 20px;
    }
  }
}
</style>
