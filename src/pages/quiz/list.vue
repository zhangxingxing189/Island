<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <Head />

    <!-- 主要内容区域 -->
    <main class="pt-24 pb-12 px-4">
      <div class="max-w-4xl mx-auto space-y-6">
        <div class="rounded-lg p-6 shadow-sm transition-shadow duration-300 cursor-pointer bg-gradient-to-r from-purple-600 to-blue-500">
          <h2 class="text-2xl font-bold text-white">数学题库</h2>
        </div>
        <div
            v-for="(item, index) in questionBanks"
            :key="index"
            @click="handleQuestionBankClick(item)"
            class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
        >
          <div class="flex items-start space-x-6">
            <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                  v-if="item.logo_url == ''"
                  src="@/assets/images/question_bank_logo.png"
                  :alt="item.title"
                  class="w-full h-full object-cover"
              />
              <img
                  v-else
                  :src="item.logo_url"
                  :alt="item.title"
                  class="w-full h-full object-cover"
              />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ item.title }}
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                {{ item.description }}
              </p>
              <div class="mt-3 flex items-center text-sm text-gray-500">
                <i class="fas fa-file-alt mr-2"></i>
                <span>{{ item.count }} 道题目</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import Head from "@/pages/blogPages/index.vue";
import {useRoute} from "vue-router";
import {get_question_bank_list} from "@/api/questionApi";
import router from "@/router";

const route = useRoute()

// 获取题库信息
let islandName = ref("岛屿名")

let questionBanks = ref([{
  question_bank_id: 0,
}])

onMounted(async () => {
  try {
    const data = await get_question_bank_list({island_id: String(route.params.id)})
    questionBanks.value = data.data.question_banks
    console.log(questionBanks.value);
  } catch (error) {
    console.error("获取题库信息失败:", error);
  }
});


interface QuestionBank {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  questionCount: number;
  userCount: number;
}
//
// const questionBanks = ref<QuestionBank[]>([
//   {
//     id: 1,
//     title: "高级前端开发工程师题库",
//     description:
//         "包含 Vue、React、TypeScript、性能优化等前端核心技术的综合题目，助你快速提升技术深度。",
//     imageUrl:
//         "https://public.readdy.ai/ai/img_res/5ac8e9a51d7a8b2703bcbacd5a8c4a17.jpg",
//     questionCount: 358,
//     userCount: 12659,
//   },
//   {
//     id: 2,
//     title: "算法与数据结构精选题集",
//     description:
//         "精心筛选的算法题目，覆盖常见数据结构、排序算法、动态规划等，配有详细解析和最优解答。",
//     imageUrl:
//         "https://public.readdy.ai/ai/img_res/e3a277069ad67d20d72179a8a893f677.jpg",
//     questionCount: 246,
//     userCount: 8934,
//   },
//   {
//     id: 3,
//     title: "系统设计面试题库",
//     description:
//         "涵盖分布式系统、微服务架构、数据库设计等核心知识点，帮助你应对系统设计面试。",
//     imageUrl:
//         "https://public.readdy.ai/ai/img_res/cca34e6e5559681676d1832236da71af.jpg",
//     questionCount: 189,
//     userCount: 6723,
//   },
//   {
//     id: 4,
//     title: "计算机网络实践题库",
//     description:
//         "从 TCP/IP 协议到网络安全，全面覆盖计算机网络知识，配有实际案例分析。",
//     imageUrl:
//         "https://public.readdy.ai/ai/img_res/d9bafd9b4f9d409cc4f98560411175f8.jpg",
//     questionCount: 275,
//     userCount: 9156,
//   },
//   {
//     id: 5,
//     title: "数据库优化专项训练",
//     description:
//         "专注于数据库性能优化、索引设计、SQL 调优等实战题目，提升数据库开发能力。",
//     imageUrl:
//         "https://public.readdy.ai/ai/img_res/ae1084426690d81b702082b742fd4111.jpg",
//     questionCount: 167,
//     userCount: 5438,
//   },
// ]);

const handleQuestionBankClick = (item: QuestionBank) => {
  // 跳转
  router.push({ path: "/quiz/question-bank/" + item.question_bank_id });
  console.log("进入题库:", item.title);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
