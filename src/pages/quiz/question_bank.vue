<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <div
        class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center px-6"
    >
      <div class="flex items-center gap-2">
        <i class="fas fa-code text-2xl text-blue-600"></i>
        <span class="text-xl font-bold text-gray-900">海岛</span>
      </div>
      <div class="flex-1 text-center text-lg font-medium text-gray-700">
        {{ questionBankName }}
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-600">{{ currentUser.username }}</span>
        <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
          <img
              :src= "currentUser.avatar"
              alt="用户头像"
              class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
    <!-- 左侧固定面板 -->
    <div
        class="fixed left-0 top-16 w-[400px] h-[calc(100vh-64px)] bg-white border-r border-gray-200 p-4 overflow-hidden flex flex-col"
    >
      <!-- PK匹配按钮 -->
      <button
          @click="startPKMatch"
          class="!rounded-button mb-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 flex items-center justify-center gap-2 hover:opacity-90 cursor-pointer whitespace-nowrap"
      >
        <i class="fas fa-gamepad"></i>
        <span>开始 PK 匹配</span>
      </button>
      <!-- 分割线 -->
      <hr class="mb-4" />
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
      <!-- 题目列表 -->
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div
            v-for="question in filteredQuestions"
            :key="question.question_id"
            class="p-2 border-b border-gray-100 cursor-pointer"
            @click="selectQuestion(question)"
            :class="{
              'bg-blue-50': selectedQuestion?.question_id === question.question_id,
              'hover:bg-gray-50' : selectedQuestion?.question_id !== question.question_id
            }"
        >
          <div class="flex items-center justify-between mb-0">
            <span class="text-gray-900 font-medium mb-1 mt-1">
              {{ question.title }}
            </span>
            <div
                :class="getDifficultyClass(question.difficulty)"
                class="px-2 py-1 rounded text-xs"
            >
              {{ getDifficultName(question.difficulty) }}
            </div>
          </div>
          <div
              class="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
          >
            {{ getTypeName(question.type) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧内容区 -->
    <div class="ml-[400px] pt-24 px-8 pb-8">
      <div v-if="selectedQuestion" class="max-w-4xl mx-auto">
        <!-- 题目内容 -->
        <div class="bg-white rounded-lg p-0 shadow-sm mb-6">
          <div class="flex items-center gap-4 mb-4">
            <h1 class="text-2xl font-bold ms-6 mt-5">{{ selectedQuestion.title }}</h1>
            <div
                class="inline-block bg-gray-100 text-gray-600 mt-5 px-3 py-1 rounded"
            >
              {{ getTypeName(selectedQuestion.type) }}
            </div>
            <div
                :class="getDifficultyClass(selectedQuestion.difficulty)"
                class="mt-5 px-3 py-1 rounded"
            >
              {{ getDifficultName(selectedQuestion.difficulty) }}
            </div>
          </div>
          <div>
            <mavon-editor
                v-model="questionInfo.content"
                :editable="false"
                :subfield="false"
                :toolbarsFlag="false"
                :boxShadow="false"
                previewBackground = "#ffffff"
                defaultOpen="preview"
                style="min-height: 10px; border: 0; padding: 0;"
            />
          </div>
          <hr class="mb-8"/>
<!--          选项-->
          <div v-if="selectedQuestion.type === 1 || selectedQuestion.type === 2">
            <div v-for="(option, index) in questionInfo.options" :key="index" class="-my-7 flex items-center">
              <p class="ml-6 -mt-5">
                {{ String.fromCharCode(65 + index) + ' .'}}
              </p>
              <div>
                <mavon-editor
                    v-model="questionInfo.options[index]"
                    :editable="false"
                    :subfield="false"
                    :toolbarsFlag="false"
                    :boxShadow="false"
                    previewBackground="#ffffff"
                    defaultOpen="preview"
                    style="min-height: 10px; border: 0; padding: 0; margin: 0;"
                />
              </div>
            </div>
          </div>
        </div>
        <br>
<!--        答案部分-->
        <div class="bg-white rounded-lg py-1 shadow-sm mb-6">
          <div class="text-2xl font-bold ml-6 m-5">答案解析</div>
          <hr/>
          <div class="text-1xl ml-6 m-5">
            {{ answerText }}
          </div>
        </div>
      </div>
    </div>
    <!-- PK匹配弹窗 -->
    <div
        v-if="showPKModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]"
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
import {ref, computed , onMounted, watch} from "vue";
import { useRoute } from 'vue-router'
import {get_question, get_question_bank, get_question_list} from "@/api/questionApi";
import { mavonEditor } from 'mavon-editor'
import {useUserStore} from "@/stores/user";
import Head from "@/pages/blogPages/index.vue";


const userStore = useUserStore();
const currentUser = userStore.currentUser;

// 获取路由参数方式
const route = useRoute()
console.log(route.params.id);

// 获取题库信息
let questionBankName = ref("题库名")

onMounted(async () => {
  try {
    const data = await get_question_bank({question_bank_id: String(route.params.id)})
    questionBankName.value = data.data.title
    console.log(data.data.title);
  } catch (error) {
    console.error("获取题库信息失败:", error);
  }
});

// 获取题库题目列表
let questionList = ref([]);
onMounted(async () => {
  try {
    const data = await get_question_list({question_bank_id: String(route.params.id)})
    questionList.value = data.data.questions
    selectedQuestion.value = data.data.questions[0]
    console.log(questionList);
  } catch (error) {
    console.error("获取题库题目列表失败:", error);
  }
});

const showPKModal = ref(false);
const matchingTime = ref(0);

// 搜索题目部分
const searchQuery = ref("");
const filteredQuestions = computed(() => {
  if (!searchQuery.value) return questionList.value;
  return questionList.value.filter(
      (p) =>
          p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          p.question_id.toString().includes(searchQuery.value),
  );
});

// 难度、类型转换函数部分
const getDifficultyClass = (difficulty: number) => {
  switch (difficulty) {
    case 1:
      return "bg-green-100 text-green-600";
    case 2:
      return "bg-yellow-100 text-yellow-600";
    case 3:
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};
const getDifficultName = (difficulty: number) => {
  switch (difficulty) {
    case 1:
      return "简单";
    case 2:
      return "中等";
    case 3:
      return "困难";
    default:
      return "未知";
  }
}
const getTypeName = (type: number) => {
  switch (type) {
    case 1:
      return "单选题";
    case 2:
      return "多选题";
    case 3:
      return "填空题";
    case 4:
      return "主观题";
    default:
      return "未知";
  }
}

// 题目选择部分
const selectedQuestion = ref<any>(null);
const selectQuestion = (question: any) => {
  selectedQuestion.value = question;
};

let questionInfo = ref({
  content: "",
  options: [],
  answers: [],
});
let answerText = ref("");

// 监听题目选择变化，从后端获取题目详情
watch(selectedQuestion, async (newValue) => {
  if (newValue) {
    try {
      const data = await get_question({question_id: String(newValue.question_id)})
      questionInfo.value = data.data;
      getAnswerText();
    } catch (error) {
      console.error("获取题目详细信息失败:", error);
    }
  }
});

const getAnswerText = () => {
  answerText.value = ""
  if (selectedQuestion.value.type === 1) {
    for (let i = 0; i < questionInfo.value.options.length; i++) {
      if (questionInfo.value.options[i] === questionInfo.value.answers[0]) {
        console.log("成功");
        answerText.value = String.fromCharCode(65 + i)
        return;
      }
    }
  } else if (selectedQuestion.value.type === 2) {
    let cnt = 0;
    for (let i = 0; i < questionInfo.value.options.length; i++) {
      if (questionInfo.value.options[i] === questionInfo.value.answers[cnt]) {
        answerText.value += String.fromCharCode(65 + i)
        cnt++;
        if (cnt >= questionInfo.value.answers.length) {
          return;
        }
      }
    }
  } else if (selectedQuestion.value.type === 3) {
    answerText.value = questionInfo.value.answers.join('，');
  } else if (selectedQuestion.value.type === 4) {
    answerText.value = questionInfo.value.answers[0];
  }
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
