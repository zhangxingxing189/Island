<template>
  <div class="island-gallery">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-spinner">
      <a-spin size="large" tip="正在加载岛屿数据..." />
    </div>

    <!-- 错误提示 -->
    <a-alert
      v-else-if="error"
      type="error"
      show-icon
      :message="error"
      class="error-alert"
    />

    <!-- 主展示区域 -->
    <div v-else class="gallery-container">
      <h1 class="gallery-title">梦幻岛屿图鉴</h1>
      <div class="island-grid">
        <div
          v-for="island in islands"
          :key="island.id"
          class="island-card"
          @mouseenter="hoverCardId = island.id"
          @mouseleave="hoverCardId = null"
        >
          <div class="card-inner" :class="{ hover: hoverCardId === island.id }">
            <!-- 岛屿图片 -->
            <div class="image-container">
              <img
                :src="island.path"
                :alt="island.name"
                class="island-image"
                :style="imageStyle(island)"
              />
              <div class="image-overlay">
                <div class="coordinate-badge">
                  <span class="coordinate-label">坐标</span>
                  <span class="coordinate-value"
                    >({{ island.x }}, {{ island.y }})</span
                  >
                </div>
              </div>
            </div>

            <!-- 岛屿信息 -->
            <div class="island-meta">
              <h3 class="island-name">{{ island.name }}</h3>
              <div class="image-dimensions">
                <a-tooltip title="原始分辨率">
                  <span class="dimension-item">
                    <span class="icon-camera"></span>
                    {{ island.imageWidth }}×{{ island.imageHeight }}
                  </span>
                </a-tooltip>
                <a-divider type="vertical" />
                <a-tooltip title="显示比例">
                  <span class="aspect-ratio">
                    {{ (island.imageWidth / island.imageHeight).toFixed(2) }}:1
                  </span>
                </a-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { islandType, getIslands } from "@/api/islandApi";

// 响应式数据
const islands = ref<islandType[]>([]);
const loading = ref(true);
const error = ref("");
const hoverCardId = ref<string | null>(null);

// 加载数据
const loadIslands = async () => {
  try {
    const data = await getIslands();
    islands.value = data.map((item) => ({
      ...item,
      name: item.name || "未命名岛屿",
    }));
  } catch (err) {
    error.value = "岛屿数据加载失败，请稍后刷新重试";
    console.error("API请求错误:", err);
  } finally {
    loading.value = false;
  }
};

// 图片尺寸样式
const imageStyle = (island: islandType) => ({
  transform: hoverCardId.value === island.id ? "scale(1.05)" : "none",
});

onMounted(() => {
  loadIslands();
});
</script>

<style scoped>
.island-gallery {
  padding: 40px 5%;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  padding: 100px 0;
}

.error-alert {
  margin: 40px 10%;
  max-width: 800px;
}

.gallery-container {
  max-width: 1400px;
  margin: 0 auto;
}

.gallery-title {
  text-align: center;
  font-size: 2.5em;
  color: #1890ff;
  margin-bottom: 40px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.island-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  padding: 20px;
}

.island-card {
  perspective: 1000px;
  cursor: pointer;
  transition: transform 0.3s;
}

.island-card:hover {
  transform: translateY(-5px);
}

.card-inner {
  position: relative;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  overflow: hidden;
}

.card-inner.hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-inner.hover .image-overlay {
  opacity: 1;
}

.image-container {
  position: relative;
  padding-top: 56.25%; /* 默认16:9比例 */
  background: #f0f2f5;
}

.island-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 60%,
    rgba(0, 0, 0, 0.5) 100%
  );
  opacity: 0.8;
  transition: opacity 0.3s;
}

.coordinate-badge {
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: rgba(255, 255, 255, 0.9);
  padding: 6px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.coordinate-label {
  color: #666;
  font-size: 0.9em;
  margin-right: 8px;
}

.coordinate-value {
  color: #1890ff;
  font-weight: 500;
  font-family: monospace;
}

.island-meta {
  padding: 20px;
}

.island-name {
  margin: 0 0 12px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 1.3em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-dimensions {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.9em;
}

.dimension-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.icon-camera {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='%23666666' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 15a3 3 0 100-6 3 3 0 000 6z'/%3E%3Cpath d='M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z'/%3E%3C/svg%3E")
    no-repeat center;
}

.aspect-ratio {
  font-family: monospace;
  background: rgba(24, 144, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  color: #1890ff;
}

@media (max-width: 768px) {
  .gallery-title {
    font-size: 2em;
    margin-bottom: 30px;
  }

  .island-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 10px;
  }
}
</style>
