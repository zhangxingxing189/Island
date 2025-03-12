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
              <div v-if = "pkInfo.winner_id === '0'" class="text-sm opacity-80">
                答题进度 (
                {{ myFinishedCount }}
                /
                {{ questions.length }}
                )
              </div>
              <div v-else class="text-sm opacity-80">
                <div v-if = "pkInfo.winner_id === String(myID)" class="text-green-500 font-bold">
                  获胜者
                </div>
                <div v-else class="text-gray-200">
                  落败者
                </div>
              </div>
              <div class="text-2xl font-bold mt-1">{{ myScore }}分</div>
            </div>
          </div>
          <!-- VS区域 -->
          <div class="text-center">
            <div class="text-3xl font-bold mb-2">VS</div>
            <div v-if = "pkInfo.winner_id === '0'" class="text-xl" >
              <i class="far fa-clock"></i>
              <span class="ml-2">{{ formatTime(remainingTime) }}</span>
            </div>
            <div v-else class="text-xl text-green-500">
              <i class="fas fa-check-circle"></i>
              <span class="ml-2">比赛结束！</span>
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
              <div v-if = "pkInfo.winner_id === '0'" class="text-sm opacity-80">
                答题进度 (
                {{ opponentFinishedCount }}
                /
                {{ questions.length }}
                )
              </div>
              <div v-else class="text-sm opacity-80">
                <div v-if = "pkInfo.winner_id === opponentUserID" class="text-green-500 font-bold">
                  获胜者
                </div>
                <div v-else class="text-gray-200">
                  落败者
                </div>
              </div>
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
                <i :class="getMyQuestionStatus(question).icon"></i>
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
            <div class="ml-auto min-w-20">
              得分:
              <span
                  :class="{
                    'text-green-500': questionScore === 100,
                    'text-yellow-500': questionScore >= 50 && questionScore < 100,
                    'text-red-500': questionScore <= 50,
                  }"
              >
                {{ questionScore }}
              </span>
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
                  :class="{
                    'border-indigo-500': selectedAnswer === option && !buttonDisabled,
                    'hover:border-gray-300' : selectedAnswer != option && !buttonDisabled,
                    'cursor-not-allowed' : buttonDisabled && !buttonDisabled,
                    
                    'border-red-500': redAnswers.includes(option) && buttonDisabled,
                    'border-green-500': greenAnswers.includes(option) && buttonDisabled,
                  }"
              >
                <input
                    type="radio"
                    :value="option"
                    v-model="selectedAnswer"
                    class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    :disabled = buttonDisabled
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
                  :class="{
                    'border-indigo-500': selectedAnswers.includes(option) && !buttonDisabled,
                    'hover:border-gray-300' : !selectedAnswers.includes(option) && !buttonDisabled,

                    'border-red-500': redAnswers.includes(option) && buttonDisabled,
                    'border-green-500': greenAnswers.includes(option) && buttonDisabled
                    }"
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
                  :disabled = buttonDisabled

                  :class="{
                    'text-red-500' : redAnswers.includes(selectedAnswer) && buttonDisabled,
                    'text-green-500' : greenAnswers.includes(selectedAnswer) && buttonDisabled
                  }"
              />
              <div v-if="buttonDisabled" class="ml-2">
                <h2 class="text-lg font-bold mt-5 mb-2">
                  正确答案:
                </h2>
                <p class="underline">
                  {{ questionInfo.answers.join('、') }}
                </p>
              </div>
            </div>
            <div class="p-3">
              <button
                  @click="submitAnswer"
                  class="!rounded-button whitespace-nowrap w-full text-white py-3 px-6 text-lg font-medium transition-colors cursor-pointer ml-3 mt-6 "
                  :class = "{ 'bg-gray-300 cursor-not-allowed': buttonDisabled , 'bg-indigo-600 hover:bg-indigo-700' : !buttonDisabled }"
                  :disabled = buttonDisabled
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
import {ref, computed, onMounted, watch, Ref, onBeforeUnmount} from "vue";
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
  winner_id: "0",
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

// 完成题目
let myFinishedCount = ref(0);
let opponentFinishedCount = ref(0);

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
  // 初始化
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


// 计时器
// 轮询房间信息
const intervalID_updateRoomInfo = ref(null);
onMounted(() => {
  intervalID_updateRoomInfo.value = setInterval( () => {
    updateRoomInfo();
    //console.log(questions.value);
  }, 5000);
})
// 倒计时
const intervalID_remainingTime = ref(null);
let remainingTime = ref(0); // 30分钟
onMounted(() => {
  intervalID_remainingTime.value = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--;
    }
  },1000);
})
// 清除计时器
onBeforeUnmount(() => {
  if (intervalID_updateRoomInfo.value) {
    clearInterval(intervalID_updateRoomInfo.value);
    intervalID_updateRoomInfo.value = null; // 可选，重置ID
  }
  if (intervalID_remainingTime.value) {
    clearInterval(intervalID_remainingTime.value);
    intervalID_remainingTime.value = null; // 可选，重置ID
  }
  console.log('定时器已清除');
})



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
  // 获得完成数目
  myFinishedCount.value = 0;
  opponentFinishedCount.value = 0;
  for (let i = 0; i < pkInfo.value.questions.length; i++) {
    if (myID.value === pkInfo.value.user1_id) {
      if (pkInfo.value.questions[i].user1_submit) {
        myFinishedCount.value++;
      }
      if (pkInfo.value.questions[i].user2_submit) {
        opponentFinishedCount.value++;
      }
    } else {
      if (pkInfo.value.questions[i].user2_submit) {
        myFinishedCount.value++;
      }
      if (pkInfo.value.questions[i].user1_submit) {
        opponentFinishedCount.value++;
      }
    }
  }
}


const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// 题目列表
let questions = ref([{
  question_id: "",
  user1_submit: false,
  user2_submit: false,
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

let selectedQuestion = ref({
  question_id: "",
  your_submit: false,
  your_score: 0,
});

const selectQuestion = (item : any) => {
  selectedQuestion.value = item;
  console.log(selectedQuestion.value);
};

let buttonDisabled = ref(false);
let questionScore = ref(0);
// 监听题目选择变化，从后端获取题目详情
watch(selectedQuestion, async (newValue) => {
  if (newValue) {
    try {
      const data = await get_question({question_id: String(newValue.question_id)})
      questionInfo.value = data.data;
      // 判断可否提交
      buttonDisabled.value = newValue.your_submit;
      questionScore.value = newValue.your_score;
      // 清空选择
      selectedAnswers.value = [];
      selectedAnswer.value = "";
      // 显示颜色
      redAnswers.value = redAnswersMap.get(newValue.question_id) || [];
      greenAnswers.value = greenAnswersMap.get(newValue.question_id) || [];
      if (buttonDisabled.value) {
        if (redAnswers.value.length > 0) {
          selectedAnswer.value = redAnswers.value[0];
        } else {
          selectedAnswer.value = greenAnswers.value[0];
        }
      }
      //console.log(questionInfo.value);
    } catch (error) {
      console.error("获取题目详细信息失败:", error);
    }
  }
});

// 获取颜色
const getMyQuestionStatus = (question: any) => {
  // 判断提交和分数
  //console.log(question);

  // 返回样式
  if (!question.your_submit) {
    return { icon: "far fa-circle", color: "" };
  } else if (question.your_score == 100) {
    return { icon: "fas fa-check text-green-500", color: "bg-green-50" }
  } else {
    return { icon: "fas fa-times text-red-500", color: "bg-red-50" };
  }
};

// 选择答案逻辑，假设最多10个选项
let selectedAnswer = ref("");
let selectedAnswers = ref<string[]>([]);
// 用于显示颜色。
let redAnswersMap = new Map<string,string[]>();
let greenAnswersMap = new Map<string,string[]>();

let redAnswers = ref<string[]>([]);
let greenAnswers = ref<string[]>([]);


const checkAnswer = () => {
  redAnswers.value = [];
  greenAnswers.value = [];
  if (questionInfo.value.type === 1) {
    greenAnswers.value.push(questionInfo.value.answers[0]);
    if (selectedAnswer.value != questionInfo.value.answers[0]) {
      redAnswers.value.push(selectedAnswer.value);
    }
  } else if (questionInfo.value.type === 2) {
    for (let i = 0; i < questionInfo.value.options.length; i++) {
      if  (questionInfo.value.answers.includes(questionInfo.value.answers[i])) {
        greenAnswers.value.push(questionInfo.value.answers[i]);
      } else if (selectedAnswers.value.includes(questionInfo.value.options[i])) {
        redAnswers.value.push(questionInfo.value.options[i]);
      }
    }
  } else if (questionInfo.value.type === 3) {
    if (questionInfo.value.answers.includes(selectedAnswer.value)) {
      greenAnswers.value.push(selectedAnswer.value);
    } else {
      redAnswers.value.push(selectedAnswer.value);
    }
  }


  redAnswersMap.set(selectedQuestion.value.question_id, redAnswers.value);
  greenAnswersMap.set(selectedQuestion.value.question_id, greenAnswers.value);
}


watch(selectedAnswer, async (newValue) => {
  if (newValue) {
    console.log(newValue);
  }
})


const submitAnswer = async () => {
  buttonDisabled.value = true;
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
  questionScore.value = data.data.score;
  console.log(data);
  await updateRoomInfo();

  // 检查答案
  checkAnswer();

  // 清空选择
  //selectedAnswer.value = "";
  //selectedAnswers.value = [];
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
