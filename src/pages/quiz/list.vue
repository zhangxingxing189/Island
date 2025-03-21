<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <Head />

    <!-- 主要内容区域 -->
    <main class="pt-24 pb-12 px-4">
      <div class="max-w-4xl mx-auto space-y-6">
        <div class="rounded-lg p-6 shadow-sm transition-shadow duration-300 cursor-pointer bg-gradient-to-r from-purple-600 to-blue-500">
          <h2 class="text-2xl font-bold text-white">{{ islandName }} 题库</h2>
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
import {get_island, get_question_bank_list} from "@/api/questionApi";
import router from "@/router";

const route = useRoute()

// 获取题库信息
let islandName = ref("岛屿名")
onMounted(async () => {
  try {
    const data = await get_island({island_id: String(route.params.id)})
    islandName.value = data.data.name
    console.log(islandName.value);
  } catch (error) {
    console.error("获取岛屿名失败:", error);
  }
});



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
  question_bank_id: number;
  title: string;
  description: string;
  logo_url: string;
  count: number;
}

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
