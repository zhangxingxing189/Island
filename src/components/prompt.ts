export function getContentAnalysis(
  content: string,
  stylePrompt: string // 改为自由格式风格描述
): string {
  const dynamicPrompt = `
作为资深编辑，请根据以下要求分析内容：

【源文分析】
"${content}..."（共${content.length}字）

【风格解析任务】
1. 从用户描述中提取关键要素：${stylePrompt}
   - 识别隐含的3个风格维度（语气/复杂度/受众）
   - 检测可能冲突的要求（如"专业但口语化"）
 
2. 自动生成风格矩阵：
   | 维度       | 分析结果       | 置信度 |
   |------------|----------------|--------|
   | 语气       | <AI自动判断>   | 85%    |
   | 复杂度     | <AI分级(1-5)> | --     |
   | 核心诉求   | <关键词提取>   | --     |


【输出要求】
✅ 生成200字简介（动态适应分析出的风格）
✅ 同步提供：
   - 风格解析报告
   - 3个改进方向（基于风格冲突检测）

示例风格解析：
"用户要求'学术论文但让外行能看懂' → 
🟢 学术规范 ✔️
🟡 通俗化要求（需平衡术语解释
`;

  return dynamicPrompt;
}
type AnalysisConfig = {
  emergencyLevel?: number; // 紧急程度阈值 (1-5)
  focusAreas?: string; // 用户特别关注的维度
};

export function checkNeedHelp(
  content: string,
  config?: AnalysisConfig
): string {
  return `作为拥有十年经验的编辑顾问，请通过以下维度分析写作状态：

【文本分析仪表盘】
"${content.substring(0, 300)}..."（共${content.length}字）

▌完整性检测
1. 结构检测：${[
    "开头是否建立认知锚点",
    "主体有无3+支撑论点",
    "结尾是否呼应开头",
  ].join(" | ")}
2. 内容密度：通过TF-IDF分析Top5关键词覆盖率（当前：__%）

▌困境预测模型
${[
  "是否存在段落失焦（标准差>2.5）",
  "情感曲线是否断层",
  "数据引用充分性（技术类需≥3处）",
  "故事弧完整性（起承转合）",
]
  .map((v) => `• ${v}`)
  .join("\n")}

▌智能辅助建议
1. 需要立即帮助（⚠️）：
   - ${["关键元素缺失", "逻辑断裂", "严重偏离主题"]
     .map((v) => `[${v}]`)
     .join(" ")} 
2. 建议优化（🔧）：
   - ${["过渡衔接", "情感强化", "论据升级"].map((v) => `[${v}]`).join(" ")}
3. 自主完成度（✅）：${["结构完整", "论点清晰", "数据充分"]
    .map((v) => `[${v}]`)
    .join("|")}

【输出要求】
✓ 诊断报告：使用雷达图描述5维度状态（0-5分）
✓ 紧急指数：${config?.emergencyLevel || "自动计算"}级响应
✓ 辅助方案：生成3种帮助策略（从${config?.focusAreas || "全局优化"}切入）

示例输出：
📊 完成度雷达：[结构4.2｜论点3.8｜数据2.1｜...] 
🚨 紧急程度：3级（需在3处加强）
💡 推荐帮助：1. 补充行业数据 2. 重构第2段落 3. 增加过渡引导句`;
}

export function checkContentIsGood(
  content: string,
  config?: {
    strictMode?: boolean; // 严格模式（默认false）
    target?: "technical" | "emotional" | "narrative"; // 文章类型
  }
): string {
  const analysisDimensions = {
    theme: {
      main: "准确识别3-5个核心主题关键词",
      coherence: "评估内容与主题的契合度（1-5分）",
    },
    structure: {
      flow: "分析段落逻辑（并列/递进/总分总）",
      highlight: "定位最佳表达段落和最弱段落",
    },
    enhancement: {
      keywords: "建议3个强化主题的关键词",
      hooks: "提供开头/结尾的优化方案",
      data: `${config?.target === "technical" ? "验证数据引用规范性" : ""}`,
    },
    evaluation: {
      score: "[综合评分] 用1-5分评价",
      comparison: "类比同类型优秀文章的差异",
    },
  };

  return `作为拥有10年经验的编辑总监，请分析以下博客：
【博客正文】
${content}

【分析要求】
1. 主题识别 ${analysisDimensions.theme.main}
2. 结构分析 ${analysisDimensions.structure.flow}
3. 关键词优化 ${analysisDimensions.enhancement.keywords}
4. ${config?.strictMode ? "严格模式：指出所有语法错误" : "亮点挖掘"} 
5. 情感曲线 ${config?.target === "emotional" ? "绘制情感波动图" : ""}
6. SEO建议 包含${config?.target === "technical" ? "技术术语" : "情感关键词"}优化

【输出格式】
📌 核心主题："..."
✅ 最佳段落：第X段（引用原文）
⚠️ 待改进：${analysisDimensions.structure.highlight}
✨ 修改建议：使用「问题→解决方案」格式
${config?.strictMode ? "❌ 语法错误列表：" : "🌟 写作亮点："}
（示例响应：
📌 核心主题："数字化转型" (4.2/5)
✅ 最佳段落："正如Gartner指出..." 
⚠️ 待改进：第三段案例时效性不足
✨ 修改建议：替换2020年数据→新增2023年IDC报告
🌟 写作亮点：比喻使用恰当)`;
}
