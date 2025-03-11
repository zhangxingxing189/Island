// stores/layout.ts
import { defineStore } from "pinia";
import { ref } from "vue";

// 使用组合式API风格定义store
export const useLayoutStore = defineStore("layout", () => {
  // 状态定义
  const isSelect = ref(true);

  // 操作方法
  const toggleSelect = (value?: boolean) => {
    isSelect.value = value !== undefined ? value : !isSelect.value;
  };

  // 重置状态
  const reset = () => {
    isSelect.value = true;
  };

  return {
    isSelect,
    toggleSelect,
    reset,
  };
});
