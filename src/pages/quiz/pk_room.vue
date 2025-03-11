<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <nav
        class="fixed top-0 left-0 right-0 h-14 bg-indigo-700 text-white shadow-lg z-50"
    >
      <div
          class="max-w-7xl mx-auto px-4 h-full flex items-center justify-between"
      >
        <div class="flex items-center space-x-4">
          <button
              class="!rounded-button cursor-pointer flex items-center space-x-2 hover:scale-110"
              @click="handleBack"
          >
            <i class="fas fa-arrow-left"></i>
            <span class="whitespace-nowrap">退出</span>
          </button>
          <span class="text-lg font-medium">刷题PK</span>
        </div>
        <button
            class="!rounded-button cursor-pointer"
            @click="showRules = true"
        >
          <i class="fas fa-question-circle text-xl"></i>
        </button>
      </div>
    </nav>
    <!-- 对战信息区域 -->
    <div
        class="pt-14 bg-gradient-to-b from-indigo-600 to-indigo-500 text-white"
    >
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <!-- 我方信息 -->
          <div class="text-center">
            <div class="relative">
              <img
                  :src="myAvatar"
                  class="w-20 h-20 rounded-full mx-auto object-cover"
                  alt="我的头像"
              />
              <div
                  class="absolute -bottom-1 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"
              ></div>
            </div>
            <div class="mt-2">
              <div class="font-medium">{{ myName }}</div>
              <div class="text-sm opacity-80">钻石段位</div>
              <div class="text-2xl font-bold mt-1">{{ myScore }}分</div>
            </div>
          </div>
          <!-- VS区域 -->
          <div class="text-center">
            <div class="text-3xl font-bold mb-2">VS</div>
            <div class="text-xl">
              <i class="far fa-clock"></i>
              <span class="ml-2">{{ formatTime(remainingTime) }}</span>
            </div>
          </div>
          <!-- 对方信息 -->
          <div class="text-center">
            <div class="relative">
              <img
                  :src="opponentAvatar"
                  class="w-20 h-20 rounded-full mx-auto object-cover"
                  alt="对手头像"
              />
              <div
                  class="absolute -bottom-1 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"
              ></div>
            </div>
            <div class="mt-2">
              <div class="font-medium">{{ opponentName }}</div>
              <div class="text-sm opacity-80">白金段位</div>
              <div class="text-2xl font-bold mt-1">{{ opponentScore }}分</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 答题区域 -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-4 gap-6">
        <!-- 题目列表 -->
        <div class="space-y-4">
          <div class="text-xl font-bold mb-4">题目列表</div>
          <div class="space-y-2">
            <div
                v-for="(question, index) in questions"
                :key="index"
                @click="selectQuestion(index)"
                class="cursor-pointer p-3 rounded-lg border transition-all duration-200 flex items-center justify-between"
                :class="[
currentQuestionIndex === index ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300',
getMyQuestionStatus(index).color
]"
            >
              <span class="font-medium">题 {{ index + 1 }}</span>
              <div class="flex items-center space-x-3">
                <i :class="getMyQuestionStatus(index).icon"></i>
              </div>
            </div>
          </div>
        </div>
        <!-- 答题区域 -->
        <div class="col-span-3 bg-white rounded-xl p-8 shadow-sm">
          <div v-if="currentQuestion" class="space-y-6">
            <div class="text-lg font-medium">{{ currentQuestion.title }}</div>
            <!-- 选择题 -->
            <div v-if="currentQuestion.type === '选择'" class="space-y-3">
              <label
                  v-for="(option, index) in currentQuestion.options"
                  :key="index"
                  class="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                  :class="{'border-indigo-500 bg-indigo-50': selectedAnswer === option}"
              >
                <input
                    type="radio"
                    :value="option"
                    v-model="selectedAnswer"
                    class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span>{{ option }}</span>
              </label>
            </div>
            <!-- 多选题 -->
            <div v-else-if="currentQuestion.type === '多选'" class="space-y-3">
              <label
                  v-for="(option, index) in currentQuestion.options"
                  :key="index"
                  class="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                  :class="{'border-indigo-500 bg-indigo-50': selectedAnswers.includes(option)}"
              >
                <input
                    type="checkbox"
                    :value="option"
                    v-model="selectedAnswers"
                    class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span>{{ option }}</span>
              </label>
            </div>
            <!-- 填空题 -->
            <div v-else class="space-y-3">
              <input
                  type="text"
                  v-model="selectedAnswer"
                  placeholder="请输入答案"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
                @click="submitAnswer"
                class="!rounded-button whitespace-nowrap w-full bg-indigo-600 text-white py-3 px-6 text-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              提交答案
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 规则弹窗 -->
    <div
        v-if="showRules"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">比赛规则</h3>
          <button
              @click="showRules = false"
              class="text-gray-500 hover:text-gray-700"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="space-y-4">
          <p>1. 本场比赛总时长为30分钟</p>
          <p>2. 共10道题目，包含选择题、多选题和填空题</p>
          <p>3. 每道题目答对得10分，答错不扣分</p>
          <p>4. 可以自由选择题目顺序作答</p>
          <p>5. 提交后不可更改答案</p>
        </div>
        <button
            @click="showRules = false"
            class="!rounded-button whitespace-nowrap mt-6 w-full bg-indigo-600 text-white py-2 px-4 font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          我知道了
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, computed, onMounted} from "vue";
import {useUserStore} from "@/stores/user";
import {useRoute} from "vue-router";
import {get_pk_info, get_user_info} from "@/api/pkApi";
import JSONbig from 'json-bigint';

const myScore = ref(60);
const opponentScore = ref(50);
const remainingTime = ref(1800); // 30分钟
const showRules = ref(false);
const currentQuestionIndex = ref(0);
const selectedAnswer = ref("");
const selectedAnswers = ref<string[]>([]);

// 获取路由参数方式
const route = useRoute()
console.log(route.params.id);

// 比赛房间信息
let pk_info = ref();

// 先获取用户信息
const userStore = useUserStore();
const currentUser = userStore.currentUser;

let myID = ref("");
let myName = ref("");
let myAvatar = ref("");
let opponentUserID = ref("");
let opponentName = ref("");
let opponentAvatar = ref("");

onMounted(async () => {
  myName.value = currentUser.username;
  myAvatar.value = currentUser.avatar;
  const pk_info_data= await get_pk_info({room_id: String(route.params.id)});
  if (pk_info_data.code != 20000) {
    console.log('获取房间信息失败:', pk_info_data.message);
    return;
  }
  pk_info.value = pk_info_data.data;
  console.log(pk_info);
  const tokenData = parseJWT(currentUser.atoken);
  if (tokenData) {
    console.log('用户ID:', tokenData.userid);
    myID.value = tokenData.userid;
  }
  if (pk_info.value.user1_id === myID.value) {
    opponentUserID.value = pk_info.value.user2_id;
  } else {
    opponentUserID.value = pk_info.value.user1_id;
  }
  const user_info_data = await get_user_info({user_id: opponentUserID.value});
  console.log(user_info_data);
  opponentName.value = user_info_data.data.username;
  opponentAvatar.value = user_info_data.data.avatar;
});

const parseJWT = (token: string) => {
  if (!token) return null;

  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));

    return JSONbig({ storeAsString: true }).parse(payload);
  } catch (error) {
    console.error('Token 解析失败:', error);
    return null;
  }
};

const questions = ref([
  {
    id: 1,
    type: "选择",
    title: "以下哪个不是JavaScript的数据类型？",
    options: ["String", "Boolean", "Character", "Number"],
    answer: "Character",
    myAnswer: null,
    opponentAnswer: "Character",
  },
  {
    id: 2,
    type: "多选",
    title: "以下哪些是Vue.js的生命周期钩子？",
    options: ["mounted", "created", "updated", "destroyed"],
    answer: ["mounted", "created", "updated", "destroyed"],
    myAnswer: null,
    opponentAnswer: ["mounted", "created"],
  },
  {
    id: 3,
    type: "填空",
    title: "在Vue3中，创建响应式数据的核心函数是____",
    answer: "ref",
    myAnswer: null,
    opponentAnswer: "ref",
  },
  {
    id: 4,
    type: "选择",
    title: "TypeScript是由哪个公司开发的？",
    options: ["Google", "Microsoft", "Facebook", "Apple"],
    answer: "Microsoft",
    myAnswer: null,
    opponentAnswer: null,
  },
]);
const currentQuestion = computed(
    () => questions.value[currentQuestionIndex.value],
);
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
const getMyQuestionStatus = (index: number) => {
  const question = questions.value[index];
  if (!question.myAnswer) {
    return { icon: "far fa-circle", color: "" };
  }
  const isCorrect = Array.isArray(question.answer)
      ? JSON.stringify(question.myAnswer) === JSON.stringify(question.answer)
      : question.myAnswer === question.answer;
  return isCorrect
      ? { icon: "fas fa-check text-green-500", color: "bg-green-50" }
      : { icon: "fas fa-times text-red-500", color: "bg-red-50" };
};
const selectQuestion = (index: number) => {
  currentQuestionIndex.value = index;
  selectedAnswer.value = "";
  selectedAnswers.value = [];
};
const submitAnswer = () => {
  const question = questions.value[currentQuestionIndex.value];
  if (question.type === "多选") {
    question.myAnswer = [...selectedAnswers.value];
  } else {
    question.myAnswer = selectedAnswer.value;
  }
  // 判断答案是否正确并更新分数
  const isCorrect = Array.isArray(question.answer)
      ? JSON.stringify(question.myAnswer) === JSON.stringify(question.answer)
      : question.myAnswer === question.answer;
  if (isCorrect) {
    myScore.value += 10;
  }
  // 清空选择
  selectedAnswer.value = "";
  selectedAnswers.value = [];
};
// 倒计时
setInterval(() => {
  if (remainingTime.value > 0) {
    remainingTime.value--;
  }
}, 1000);
</script>

<style scoped>
.custom-radio {
  @apply w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500;
}
.custom-checkbox {
  @apply w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
