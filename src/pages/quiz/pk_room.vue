<template>
  <div class="min-h-screen bg-gray-50" v-if="currentUser">
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
                @click="selectQuestion(question)"
                class="cursor-pointer p-3 rounded-lg border transition-all duration-200 flex items-center justify-between"
                :class="[
questionInfo.question_id === question.question_id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300',
getMyQuestionStatus(question).color
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
        <div class="col-span-3 bg-white rounded-xl p-6 pl-0 shadow-sm">
          <div v-if="questionInfo" class="flex items-center gap-4 mb-0">
            <h1 class="text-2xl font-bold ms-6">{{ questionInfo.title }}</h1>
            <div
                class="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded"
            >
              {{ getTypeName(questionInfo.type) }}
            </div>
            <div
                :class="getDifficultyClass(questionInfo.difficulty)"
                class="px-3 py-1 rounded"
            >
              {{ getDifficultName(questionInfo.difficulty) }}
            </div>
          </div>
          <hr class="mt-4 ml-5"/>
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
            <!-- 选择题 -->
          <div>
            <div v-if="questionInfo.type === 1" class="space-y-3 ml-5">
              <label
                  v-for="(option, index) in questionInfo.options"
                  :key="index"
                  class="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-100 cursor-pointer transition-all duration-200 "
                  :class="{ 'border-indigo-500': selectedAnswer === option , 'hover:border-gray-300' : selectedAnswer != option}"
              >
                <input
                    type="radio"
                    :value="option"
                    v-model="selectedAnswer"
                    class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <mavon-editor
                    v-model="questionInfo.options[index]"
                    :editable="false"
                    :subfield="false"
                    :toolbarsFlag="false"
                    :boxShadow="false"
                    previewBackground="#ffffff"
                    defaultOpen="preview"
                    style="min-height: 10px; border: 0; padding: 0; margin: 0; margin-bottom: -12px"
                />
              </label>
            </div>
            <!-- 多选题 -->
            <div v-else-if="questionInfo.type === 2" class="space-y-3 ml-5">
              <label
                  v-for="(option, index) in questionInfo.options"
                  :key="index"
                  class="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-100 cursor-pointer transition-all duration-200"
                  :class="{ 'border-indigo-500': selectedAnswers.includes(option) ,'hover:border-gray-300' : !selectedAnswers.includes(option)}"
              >
                <input
                    type="checkbox"
                    :value="option"
                    v-model="selectedAnswers"
                    class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <mavon-editor
                    v-model="questionInfo.options[index]"
                    :editable="false"
                    :subfield="false"
                    :toolbarsFlag="false"
                    :boxShadow="false"
                    previewBackground="#ffffff"
                    defaultOpen="preview"
                    style="min-height: 10px; border: 0; padding: 0; margin: 0; margin-bottom: -12px"
                />
              </label>
            </div>
            <!-- 填空题 -->
            <div v-else class="space-y-3 ml-5">
              <input
                  type="text"
                  v-model="selectedAnswer"
                  placeholder="请输入答案"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div class="p-3">
              <button
                  @click="submitAnswer"
                  class="!rounded-button whitespace-nowrap w-full bg-indigo-600 text-white py-3 px-6 text-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer ml-3 mt-6 "
              >
                提交答案
              </button>
            </div>

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
  <div v-else>
    <div class="text-center text-2xl font-bold m-96">
      <h1 class="mb-6 ml-4">
        加载中...
      </h1>
      <div class="animate-spin mb-6">
        <i class="fas fa-circle-notch text-4xl text-blue-500"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, computed, onMounted, watch} from "vue";
import {useUserStore} from "@/stores/user";
import {useRoute} from "vue-router";
import {get_pk_info, get_user_info , pk_submit} from "@/api/pkApi";
import JSONbig from 'json-bigint';
import {get_question} from "@/api/questionApi";
import { mavonEditor } from 'mavon-editor'

const showRules = ref(false);

// 获取路由参数方式
const route = useRoute()
console.log(route.params.id);

// 比赛房间信息
let pkInfo = ref({
  end_timestamp: 0,
  start_timestamp: 0,
  user1_id: "",
  user2_id: "",
  questions: [],
  user1_score_total: 0,
  user2_score_total: 0,
});

// 先获取用户信息
const userStore = useUserStore();
const currentUser = userStore.currentUser;

let myID = ref("");
let myName = ref("");
let myAvatar = ref("");
const myScore = ref(0);
let opponentUserID = ref("");
let opponentName = ref("");
let opponentAvatar = ref("");
const opponentScore = ref(0);

// 初始化信息
onMounted(async () => {
  // 初始化自己的信息
  myName.value = currentUser.username;
  myAvatar.value = currentUser.avatar;
  // 获取初始房间信息
  const pk_info_data= await get_pk_info({room_id: String(route.params.id)});
  if (pk_info_data.code != 20000) {
    console.log('获取房间信息失败:', pk_info_data.message);
    return;
  }
  pkInfo.value = pk_info_data.data;
  console.log(pkInfo);
  // 获取自己的用户ID
  const tokenData = parseJWT(currentUser.atoken);
  if (tokenData) {
    console.log('用户ID:', tokenData.userid);
    myID.value = tokenData.userid;
  }
  // 通过自己的ID判断对方的ID
  if (pkInfo.value.user1_id === myID.value) {
    opponentUserID.value = pkInfo.value.user2_id;
  } else {
    opponentUserID.value = pkInfo.value.user1_id;
  }
  // 获取对手的用户信息
  console.log(opponentUserID.value);
  const user_info_data = await get_user_info({user_id: opponentUserID.value});
  console.log(user_info_data);
  opponentName.value = user_info_data.data.username;
  opponentAvatar.value = user_info_data.data.avatar;
  // 获取题目列表
  questions.value = pkInfo.value.questions;
  selectedQuestion.value = pkInfo.value.questions[0];
  console.log(questions);
  //初始化
  await updateRoomInfo();
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

// 轮询房间信息
setInterval( () => {
  updateRoomInfo();
}, 2000);

const updateRoomInfo = async () => {
  const pk_info_data = await get_pk_info({room_id: String(route.params.id)});
  if (pk_info_data.code != 20000) {
    console.log('获取房间信息失败:', pk_info_data.message);
    return;
  }
  pkInfo.value = pk_info_data.data;
  questions.value = pkInfo.value.questions;
  // 倒计时更新
  // 获取目前时间戳(毫秒)
  const now = new Date().getTime();
  const end = pkInfo.value.end_timestamp;
  remainingTime.value = Math.floor((end - now)/1000);
  // 获取分数
  if (myID.value == pkInfo.value.user1_id) {
    myScore.value = pkInfo.value.user1_score_total;
    opponentScore.value = pkInfo.value.user2_score_total;
  } else {
    myScore.value = pkInfo.value.user2_score_total;
    opponentScore.value = pkInfo.value.user1_score_total;
  }
}

// 倒计时
let remainingTime = ref(0); // 30分钟
setInterval(() => {
  if (remainingTime.value > 0) {
    remainingTime.value--;
  }
}, 5000);

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// 题目列表
let questions = ref([{

}])

// 选择题目逻辑
let questionInfo = ref({
  question_id: "",
  type: 1,
  difficulty: 1,
  title: "",
  content: "",
  options: [],
  answers: [],
});

const selectedQuestion = ref<any>(null);
const selectQuestion = (item : any) => {
  selectedQuestion.value = item;
  console.log(selectedQuestion.value);
};

// 监听题目选择变化，从后端获取题目详情
watch(selectedQuestion, async (newValue) => {
  if (newValue) {
    try {
      const data = await get_question({question_id: String(newValue.question_id)})
      questionInfo.value = data.data;
      // 清空选择
      selectedAnswers.value = [];
      selectedAnswer.value = "";
      console.log(questionInfo.value);
    } catch (error) {
      console.error("获取题目详细信息失败:", error);
    }
  }
});

// 获取颜色
const getMyQuestionStatus = (question: any) => {
  // 判断提交和分数
  let submit = false;
  let score = 0;
  if (myID.value == pkInfo.value.user1_id) {
    submit = question.user1_submit;
    score = question.user1_score;
  } else {
    submit = question.user2_submit;
    score = question.user2_score;
  }
  // 返回样式
  if (!submit) {
    return { icon: "far fa-circle", color: "" };
  } else if (score==100) {
    return { icon: "fas fa-check text-green-500", color: "bg-green-50" }
  } else {
    return { icon: "fas fa-times text-red-500", color: "bg-red-50" };
  }
};

// 选择答案逻辑，假设最多10个选项
let selectedAnswer = ref("");
let selectedAnswers = ref<string[]>([]);

watch(selectedAnswer, async (newValue) => {
  if (newValue) {
    console.log(newValue);
  }
})


const submitAnswer = async () => {
  let answers = [];
  let answer = "";
  if (questionInfo.value.type === 2) {
    answers = [...selectedAnswers.value];
    console.log(answers);
  } else {
    answers.push(selectedAnswer.value);
    console.log(answers);
  }
  // 发送提交
  console.log(questionInfo.value);
  const data = await pk_submit({
    room_id: String(route.params.id),
    question_id: String(selectedQuestion.value.question_id),
    answer: answers
  })
  console.log(data);
  await updateRoomInfo();


  // // 判断答案是否正确并更新分数
  // const isCorrect = Array.isArray(question.answer)
  //     ? JSON.stringify(question.myAnswer) === JSON.stringify(question.answer)
  //     : question.myAnswer === question.answer;
  // if (isCorrect) {
  //   myScore.value += 10;
  // }

  // 清空选择
  selectedAnswer.value = "";
  selectedAnswers.value = [];
};

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
