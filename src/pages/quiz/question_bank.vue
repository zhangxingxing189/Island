<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 左侧固定面板 -->
    <div
        class="fixed left-0 top-0 w-[400px] h-screen bg-white border-r border-gray-200 p-4 overflow-hidden flex flex-col"
    >
      <!-- 搜索区域 -->
      <div class="relative mb-4">
        <i
            class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        ></i>
        <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索题目"
            class="w-full pl-10 pr-4 py-2 rounded-lg border-none bg-gray-100 focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <!-- 搜索历史 -->
      <div v-if="searchHistory.length > 0" class="mb-4">
        <div class="text-sm text-gray-500 mb-2">搜索历史</div>
        <div class="flex flex-wrap gap-2">
          <span
              v-for="(item, index) in searchHistory"
              :key="index"
              @click="applySearch(item)"
              class="text-xs bg-gray-100 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-200"
          >
            {{ item }}
          </span>
        </div>
      </div>

      <!-- PK匹配按钮 -->
      <button
          @click="startPKMatch"
          class="!rounded-button mb-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 flex items-center justify-center gap-2 hover:opacity-90 cursor-pointer whitespace-nowrap"
      >
        <i class="fas fa-gamepad"></i>
        <span>开始 PK 匹配</span>
      </button>

      <!-- 题目列表 -->
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div
            v-for="problem in filteredProblems"
            :key="problem.id"
            @click="selectProblem(problem)"
            :class="{'bg-blue-50': selectedProblem?.id === problem.id}"
            class="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-500">#{{ problem.id }}</span>
            <div
                :class="getDifficultyClass(problem.difficulty)"
                class="px-2 py-1 rounded text-xs"
            >
              {{ problem.difficulty }}
            </div>
          </div>
          <div class="text-gray-900 font-medium mb-2">{{ problem.title }}</div>
          <div class="flex items-center gap-2">
            <span
                :class="problem.status === '已完成' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'"
                class="px-2 py-1 rounded text-xs"
            >
              {{ problem.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧内容区 -->
    <div class="ml-[400px] p-8">
      <div v-if="selectedProblem" class="max-w-4xl mx-auto">
        <!-- 题目头部 -->
        <div class="mb-8">
          <div class="flex items-center gap-4 mb-4">
            <h1 class="text-2xl font-bold">{{ selectedProblem.title }}</h1>
            <div
                :class="getDifficultyClass(selectedProblem.difficulty)"
                class="px-3 py-1 rounded"
            >
              {{ selectedProblem.difficulty }}
            </div>
          </div>
          <div class="flex gap-6 text-sm text-gray-500">
            <span>提交次数：{{ selectedProblem.submissions }}</span>
            <span>通过率：{{ selectedProblem.passRate }}</span>
          </div>
        </div>

        <!-- 题目内容 -->
        <div class="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div class="prose max-w-none">
            <div class="mb-6">
              <h2 class="text-lg font-medium mb-4">题目描述</h2>
              <p>{{ selectedProblem.description }}</p>
            </div>
            <div class="mb-6">
              <h3 class="text-lg font-medium mb-4">示例</h3>
              <div class="bg-gray-50 p-4 rounded">
                <div class="mb-4">
                  <div class="text-sm text-gray-600 mb-2">输入：</div>
                  <pre class="bg-gray-100 p-3 rounded">
{{ selectedProblem.sampleInput }}</pre
                  >
                </div>
                <div>
                  <div class="text-sm text-gray-600 mb-2">输出：</div>
                  <pre class="bg-gray-100 p-3 rounded">
{{ selectedProblem.sampleOutput }}</pre
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 代码编辑区 -->
        <div class="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div class="mb-4">
            <select
                v-model="selectedLanguage"
                class="bg-gray-100 rounded px-3 py-2 text-sm cursor-pointer"
            >
              <option v-for="lang in languages" :key="lang" :value="lang">
                {{ lang }}
              </option>
            </select>
          </div>
          <div class="bg-gray-900 p-4 rounded-lg mb-4">
            <textarea
                v-model="code"
                class="w-full h-64 bg-transparent text-gray-200 font-mono text-sm focus:outline-none"
                placeholder="在此输入你的代码"
            ></textarea>
          </div>
          <div class="flex gap-4">
            <button
                @click="submitCode"
                class="!rounded-button bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 cursor-pointer whitespace-nowrap"
            >
              提交代码
            </button>
            <button
                @click="runTest"
                class="!rounded-button bg-gray-100 text-gray-700 px-6 py-2 hover:bg-gray-200 cursor-pointer whitespace-nowrap"
            >
              运行测试
            </button>
            <button
                @click="resetCode"
                class="!rounded-button border border-gray-200 text-gray-600 px-6 py-2 hover:bg-gray-50 cursor-pointer whitespace-nowrap"
            >
              重置代码
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 mt-20">
        请选择一道题目开始刷题
      </div>
    </div>

    <!-- PK匹配弹窗 -->
    <div
        v-if="showPKModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-8 max-w-md w-full">
        <div class="text-center">
          <div class="text-2xl font-bold mb-4">正在匹配对手</div>
          <div class="animate-spin mb-6">
            <i class="fas fa-circle-notch text-4xl text-blue-500"></i>
          </div>
          <div class="text-gray-500 mb-6">已等待 {{ matchingTime }} 秒...</div>
          <button
              @click="cancelPKMatch"
              class="!rounded-button bg-gray-100 text-gray-700 px-6 py-2 hover:bg-gray-200 cursor-pointer whitespace-nowrap"
          >
            取消匹配
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";

const searchQuery = ref("");
const searchHistory = ref(["二叉树遍历", "动态规划", "链表反转"]);
const selectedProblem = ref<any>(null);
const showPKModal = ref(false);
const matchingTime = ref(0);
const selectedLanguage = ref("JavaScript");
const code = ref("");

const languages = ["JavaScript", "Python", "Java", "C++"];

const problems = ref([
  {
    id: 1001,
    title: "两数之和",
    difficulty: "简单",
    status: "已完成",
    submissions: 12580,
    passRate: "89%",
    description:
        "给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。",
    sampleInput: "nums = [2,7,11,15], target = 9",
    sampleOutput: "[0,1]",
  },
  {
    id: 1002,
    title: "合并两个有序链表",
    difficulty: "中等",
    status: "未完成",
    submissions: 9876,
    passRate: "75%",
    description:
        "将两个升序链表合并为一个新的升序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。",
    sampleInput: "l1 = [1,2,4], l2 = [1,3,4]",
    sampleOutput: "[1,1,2,3,4,4]",
  },
  {
    id: 1003,
    title: "最长回文子串",
    difficulty: "困难",
    status: "未完成",
    submissions: 6543,
    passRate: "62%",
    description:
        "给你一个字符串 s，找到 s 中最长的回文子串。如果字符串的反序与原始字符串相同，则该字符串称为回文字符串。",
    sampleInput: 's = "babad"',
    sampleOutput: '"bab"',
  },
]);

const filteredProblems = computed(() => {
  if (!searchQuery.value) return problems.value;
  return problems.value.filter(
      (p) =>
          p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          p.id.toString().includes(searchQuery.value),
  );
});

const getDifficultyClass = (difficulty: string) => {
  switch (difficulty) {
    case "简单":
      return "bg-green-100 text-green-600";
    case "中等":
      return "bg-yellow-100 text-yellow-600";
    case "困难":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const selectProblem = (problem: any) => {
  selectedProblem.value = problem;
};

const applySearch = (term: string) => {
  searchQuery.value = term;
};

let matchingInterval: number;

const startPKMatch = () => {
  showPKModal.value = true;
  matchingTime.value = 0;
  matchingInterval = setInterval(() => {
    matchingTime.value++;
  }, 1000);
};

const cancelPKMatch = () => {
  showPKModal.value = false;
  clearInterval(matchingInterval);
  matchingTime.value = 0;
};

const submitCode = () => {
  // 提交代码逻辑
};

const runTest = () => {
  // 运行测试逻辑
};

const resetCode = () => {
  code.value = "";
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.prose {
  max-width: none;
}
</style>
