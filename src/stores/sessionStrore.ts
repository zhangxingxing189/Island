// stores/sessionStore.ts
import { defineStore } from "pinia";

interface SessionVariables {
  directoryRule: string;
  teacherRule: string;
}
let directoryRule =
  "你需要为每个章节和小节生成一个大致纲要，描述该小节的主要内容需要详细一点。\n" +
  "  \n" +
  '  "要求": {\n' +
  "    \n" +
  '    "处理规则": [\n' +
  '      "1. 保留原始文本中的章节编号和名称（如『第1章XXX』、『2.3.1 YYY』）",\n' +
  '      "2. 包含所有层级的标题（章、节、小节）",\n' +
  '      "3. 提取标题文本，并且解释内容,和提取这个小节的大致内容",\n' +
  '      "4. 完全保留中文标点和数字编号格式",\n' +
  '      "5. 确保JSON语法正确，无重复项"\n' +
  "    ],\n" +
  '    "示例输出如下" [\n' +
  '      "第1章计算机系统概论",\n' +
  '      "1.1计算机系统简介", \n' +
  '      "1.1.1 计算机的软硬件概念:解释了计算机系统的硬件和软件的概念。硬件是计算机的实体部分，包括电子元器件和机械设备；软件则是由程序组成，用于指导计算机执行各种任务。强调了软件的重要性，尤其是在提高计算机性能和实现人类思维模拟方面的作用。",\n' +
  '      "1.1.2 计算机系统的层次结构:描述了计算机系统的多级层次结构，从实际机器（M1）到虚拟机（M2、M3、M4），再到应用语言虚拟机。介绍了不同层次结构对编程和计算机性能的影响。",\n' +
  '      "第2章计算机的发展及应用",\n' +
  '      "2.1计算机的发展史",\n' +
  '      "2.2.2 工业控制和实时控制:讲解了计算机在工业控制和实时控制系统中的应用，如自动化生产线、导弹控制和载人航天等。"\n' +
  "    ]\n" +
  "  }";
let teacherRule =
  "你是一名拥有15年教学经验的特级教师，现需要向学生讲授以下新知识：\n" +
  "{{ 插入用户提供的知识内容 }}\n" +
  "\n" +
  "请按黄金教学框架拆解与讲解：\n" +
  "\n" +
  "**1. 是什么｜概念破冰**\n" +
  "- 用「生活现象类比法」定义核心概念（例：将电流比喻为高速公路车流）\n" +
  "- 对比易混淆概念，用表格呈现差异点（如：光合作用 vs 呼吸作用）\n" +
  "\n" +
  "**2. 为什么｜价值共鸣**\n" +
  "- 结合历史故事/现实案例说明学习必要性\n" +
  "  （例：门捷列夫梦到蛇咬尾巴→元素周期表诞生→推动化学革命）\n" +
  "- 提问引发思考：_“如果不懂这个知识，未来可能遇到什么困境？”_\n" +
  "\n" +
  "**3. 怎么做｜方法论工具箱**\n" +
  "- 分步骤演示应用流程（示例代码/数学题分步解析）\n" +
  "- 提炼3-5个记忆口诀（如：三角函数公式速记法）\n" +
  "- 设计1分钟随堂小测试（单选+判断正误）\n" +
  "\n" +
  "**4. 有什么用｜知识地图锚定**\n" +
  "- 关联上下游知识点（用思维导图说明知识体系位置）\n" +
  "- 列举职业场景应用（如：编程算法→自动驾驶路径规划）\n" +
  "\n" +
  "**▌表达要求**\n" +
  "① 应该把教学框架衔接好,不要很生硬的衔接\n" +
  "② 关键结论用彩色emoji强化（如：✅ ❗🌿 ➡️）\n" +
  "③ 语言风格：亲切如面对面辅导";
export const useSessionStore = defineStore("session", {
  state: () => ({
    sessions: new Map<string, SessionVariables>(),
    // 修改后的默认规则
    defaultRules: {
      directoryRule: directoryRule,

      teacherRule: teacherRule,
    },
  }),
  actions: {
    // 获取或创建会话变量
    getSessionVariables(sessionId: string): SessionVariables {
      if (!this.sessions.has(sessionId)) {
        // 移除ID替换逻辑
        this.sessions.set(sessionId, {
          ...this.defaultRules,
        });
        this.saveToLocal();
      }
      return this.sessions.get(sessionId)!;
    },

    updateVariables(sessionId: string, variables: SessionVariables) {
      // 直接覆盖存储的变量对象
      this.sessions.set(sessionId, {
        directoryRule: variables.directoryRule,
        teacherRule: variables.teacherRule,
      });
      this.saveToLocal();
    },

    // 持久化存储
    saveToLocal() {
      const serialized = JSON.stringify(Array.from(this.sessions.entries()));
      localStorage.setItem("session-store", serialized);
    },

    // 初始化存储
    initFromLocal() {
      const localData = localStorage.getItem("session-store");
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          this.sessions = new Map(parsed);
        } catch (e) {
          localStorage.removeItem("session-store");
        }
      }
    },
  },
});
