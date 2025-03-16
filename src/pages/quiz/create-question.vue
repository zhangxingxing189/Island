<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <nav class="fixed top-0 w-full bg-white shadow-sm z-50">
      <div
          class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between"
      >
        <div class="flex items-center space-x-2">
          <i class="fas fa-book-open text-2xl text-blue-600"></i>
          <span class="text-xl font-medium">题目管理页面</span>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-gray-600">{{ currentUser.username }}</span>
          <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            <img
                :src= "currentUser.avatar"
                alt="用户头像"
                class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
    <!-- 主要内容区域 -->
    <div class="max-w-7xl mx-auto pt-24 px-4 pb-12">
      <h1 class="text-2xl font-bold mb-8">新增题目</h1>
      <div class="flex gap-6">
        <div class="w-1/2 bg-white rounded-lg shadow p-6 space-y-6">
          <!-- 基本信息 -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
              >题目标题</label
              >
              <input
                  v-model="title"
                  type="text"
                  class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入题目标题"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
              >题目内容</label
              >
              <textarea
                  v-model="content"
                  rows="4"
                  class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入题目内容"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
              >题目类型</label
              >
              <div class="relative">
                <button
                    @click="toggleTypeDropdown"
                    class="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  {{ questionTypes[selectedType] }}
                  <i class="fas fa-chevron-down absolute right-3 top-3"></i>
                </button>
                <div
                    v-if="showTypeDropdown"
                    class="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10"
                >
                  <div
                      v-for="(type, index) in questionTypes"
                      :key="index"
                      @click="selectType(index)"
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {{ type }}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">题目难度</label>
              <div class="relative">
                <button
                    @click="toggleDifficultyDropdown"
                    class="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  {{ difficultyOptions[selectedDifficulty] }}
                  <i class="fas fa-chevron-down absolute right-3 top-3"></i>
                </button>
                <div
                    v-if="showDifficultyDropdown"
                    class="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10"
                >
                  <div
                      v-for="(difficulty, index) in difficultyOptions"
                      :key="index"
                      @click="selectDifficulty(index)"
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {{ difficulty }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 选项区域 -->
          <div v-if="selectedType <= 1" class="space-y-4">
            <label class="block text-sm font-medium text-gray-700">选项</label>
            <div
                v-for="(option, index) in options"
                :key="index"
                class="flex items-center space-x-2"
            >
              <input
                  v-model="option.content"
                  type="text"
                  class="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  :placeholder="`选项 ${index + 1}`"
              />
              <div class="flex items-center space-x-2">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                      :type="selectedType === 0 ? 'radio' : 'checkbox'"
                      :name="selectedType === 0 ? 'answer' : ''"
                      :checked="option.isCorrect"
                      @change="toggleCorrectAnswer(index)"
                      class="text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span class="text-sm text-gray-600">正确答案</span>
                </label>
                <button
                    @click="removeOption(index)"
                    class="text-red-600 hover:text-red-700 !rounded-button whitespace-nowrap"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <button
                @click="addOption"
                class="text-blue-600 hover:text-blue-700 flex items-center space-x-1 !rounded-button whitespace-nowrap"
            >
              <i class="fas fa-plus"></i>
              <span>添加选项</span>
            </button>
          </div>
          <!-- 填空题答案 -->
          <div v-if="selectedType === 2" class="space-y-4">
            <label class="block text-sm font-medium text-gray-700">答案</label>
            <div
                v-for="(answer, index) in fillAnswers"
                :key="index"
                class="flex items-center space-x-2"
            >
              <input
                  v-model="answer.content"
                  type="text"
                  class="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  :placeholder="`答案 ${index + 1}`"
              />
              <button
                  @click="removeFillAnswer(index)"
                  class="text-red-600 hover:text-red-700 !rounded-button whitespace-nowrap"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <button
                @click="addFillAnswer"
                class="text-blue-600 hover:text-blue-700 flex items-center space-x-1 !rounded-button whitespace-nowrap"
            >
              <i class="fas fa-plus"></i>
              <span>添加答案</span>
            </button>
          </div>
          <!-- 主观题答案 -->
          <div v-if="selectedType === 3" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
              >参考答案</label
              >
              <textarea
                  v-model="subjectiveAnswer"
                  rows="4"
                  class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入参考答案"
              ></textarea>
            </div>
          </div>
          <!-- 操作按钮 -->
          <div class="flex justify-center space-x-4 pt-4">
            <button
                @click="saveQuestion"
                class="bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 !rounded-button whitespace-nowrap"
            >
              保存题目
            </button>
            <button
                @click="cancel"
                class="bg-gray-100 text-gray-600 px-6 py-2 hover:bg-gray-200 !rounded-button whitespace-nowrap"
            >
              取消
            </button>
          </div>
        </div>
        <!-- 预览区域 -->
        <div class="w-1/2 bg-white rounded-lg shadow p-0">
          <div v-if="title" class="ml-6 mt-6 text-2xl font-medium">{{ title }}</div>
          <hr class="my-2" />
          <div class="mt-1">
            <mavon-editor
                v-model="content"
                :editable="false"
                :subfield="false"
                :toolbarsFlag="false"
                :boxShadow="false"
                previewBackground = "#ffffff"
                defaultOpen="preview"
                style="min-height: 10px; border: 0; padding: 0;"
            />
          </div>
          <!-- 选择题选项 -->
          <div v-if="selectedType <= 1">
            <div
                v-for="(option, index) in options"
                :key="index"
                class="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 -my-1"
            >
              <p class="ml-2 -mt-5">
                {{ String.fromCharCode(65 + index) + ' .'}}
              </p>
              <div>
                <mavon-editor
                    v-model="option.content"
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

          <div class="m-6">
            <!-- 填空题答案 -->
            <div v-if="selectedType === 2" class="space-y-2">
              <div class="font-medium text-gray-700">答案：</div>
              <div class="pl-4">
                <div
                    v-for="(answer, index) in fillAnswers"
                    :key="index"
                    class="text-green-600"
                >
                  {{ index + 1 }}. {{ answer.content }}
                </div>
              </div>
            </div>
            <!-- 主观题答案 -->
            <div v-if="selectedType === 3" class="space-y-4">
              <div>
                <div class="font-medium text-gray-700 mb-2">参考答案：</div>
                <div class="pl-4 text-green-600 whitespace-pre-wrap">
                  {{ subjectiveAnswer }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 提示弹窗 -->
    <transition name="popup">
      <div
          v-if="showToast"
          class="fixed bottom-5 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
      >
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {useUserStore} from "@/stores/user";
import {login} from "@/pages/home/UIFunction";
import { mavonEditor } from 'mavon-editor'
import { useRoute } from 'vue-router'
import {create_question, get_question_bank} from "@/api/questionApi";

// 获取路由参数
const route = useRoute()
const questionBankID = route.query.bank_id

const title = ref("题目");
const content = ref("内容");

const selectedType = ref(0);
const showTypeDropdown = ref(false);
const showToast = ref(false);
const toastMessage = ref("");
const questionTypes = ["单选题", "多选题", "填空题", "主观题"];
const options = ref([
  { content: "", isCorrect: false },
  { content: "", isCorrect: false },
]);
const fillAnswers = ref([{ content: "" }]);
const subjectiveAnswer = ref("");

const difficultyOptions = ["简单", "中等", "困难"];
const selectedDifficulty = ref(0); // 默认选择简单
const showDifficultyDropdown = ref(false);

const toggleDifficultyDropdown = () => {
  showDifficultyDropdown.value = !showDifficultyDropdown.value;
};

const selectDifficulty = (index: number) => {
  selectedDifficulty.value = index;
  showDifficultyDropdown.value = false;
};

// 获取用户信息
const userStore = useUserStore();
if (userStore.loadUser() || userStore.isLogin()) {
  //
} else {
  console.log("loadFalse");
  login();
}
const currentUser = userStore.currentUser;

// 切换题目类型下拉菜单
const toggleTypeDropdown = () => {
  showTypeDropdown.value = !showTypeDropdown.value;
};
const selectType = (index: number) => {
  selectedType.value = index;
  showTypeDropdown.value = false;
};

// 选项相关操作
const addOption = () => {
  options.value.push({ content: "", isCorrect: false });
};
const removeOption = (index: number) => {
  options.value.splice(index, 1);
};


const toggleCorrectAnswer = (index: number) => {
  if (selectedType.value === 0) {
    // 单选题
    options.value.forEach((option, i) => {
      option.isCorrect = i === index;
    });
  } else {
    // 多选题
    options.value[index].isCorrect = !options.value[index].isCorrect;
  }
};

const addFillAnswer = () => {
  fillAnswers.value.push({ content: "" });
};
const removeFillAnswer = (index: number) => {
  fillAnswers.value.splice(index, 1);
};
const showToastMessage = (message: string) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const saveQuestion = async () => {
  if (!check()) {
    console.log("有未填写项");
    return;
  }
  // 处理选项
  let Options = [""];
  if (selectedType.value <= 1) {
    Options = options.value.map(option => option.content.trim());
  }
  console.log("选项" + Options)
  // 处理答案
  let Answers = [""];
  if (selectedType.value <= 1) {
    Answers = options.value.filter(option => option.isCorrect).map(option => option.content.trim());
  } else if (selectedType.value === 2) {
    Answers = fillAnswers.value.map(answer => answer.content.trim());
  } else {
    Answers = [subjectiveAnswer.value.trim()];
  }
  console.log("答案" + Answers)
  // 发送请求
  const data = {
    type: selectedType.value + 1,
    title: title.value.trim(),
    content: content.value.trim(),
    options: Options,
    answers: Answers,
    question_bank_id: String(questionBankID),
    difficulty: selectedDifficulty.value + 1,
  };
  console.log("请求体" + data);
  // 发送请求
  try {
    const resp = await create_question(data)
    console.log(resp)
  } catch (error) {
    console.log(error)
    showToastMessage("保存失败");
    return;
  }
  showToastMessage("保存成功");
};

const check = () => {
  if (!title.value.trim()) {
    showToastMessage("请输入题目标题");
    return false;
  }
  if (!content.value.trim()) {
    showToastMessage("请输入题目内容");
    return false;
  }
  // 根据题目类型验证
  if (selectedType.value <= 1) {
    // 选择题验证
    if (options.value.some((option) => !option.content.trim())) {
      showToastMessage("请填写所有选项内容");
      return false;
    }
    if (!options.value.some((option) => option.isCorrect)) {
      showToastMessage("请选择正确答案");
      return false;
    }
  } else if (selectedType.value === 2) {
    // 填空题验证
    if (fillAnswers.value.some((answer) => !answer.content.trim())) {
      showToastMessage("请填写所有答案");
      return false;
    }
  } else {
    // 主观题验证
    if (!subjectiveAnswer.value.trim()) {
      showToastMessage("请输入参考答案");
      return false;
    }
  }
  return true;
}


const cancel = () => {
  title.value = "";
  content.value = "";
  selectedType.value = 0;
  options.value = [
    { content: "", isCorrect: false },
    { content: "", isCorrect: false },
  ];
  fillAnswers.value = [{ content: "" }];
  subjectiveAnswer.value = "";
  showToastMessage("已取消");
};
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>

<style scoped>
/* 定义弹出动画 */
.popup-enter-active {
  animation: popup-in 0.3s ease-out;
}

.popup-leave-active {
  animation: popup-out 0.3s ease-in;
}

@keyframes popup-in {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes popup-out {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
}
</style>