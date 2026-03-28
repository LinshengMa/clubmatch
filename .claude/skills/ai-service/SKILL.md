# Skill: AI 服务封装（aiService.js）

## 设计原则

- **厂商无关**：不绑定任何特定 AI 服务商，兼容所有 OpenAI 格式接口
- **Mock 优先**：默认 Mock 模式，无需 API Key 即可完整演示
- **一键切换**：只需修改 `.env` 环境变量，无需改动任何业务代码

---

## 完整实现

```js
// src/services/aiService.js

// ============================================================
// 环境变量配置
// VITE_USE_MOCK_AI=true         → Mock模式（默认）
// VITE_USE_MOCK_AI=false        → 真实API模式
// VITE_AI_API_URL=              → API地址（兼容OpenAI格式）
//   例：https://api.openai.com/v1
//       https://api.anthropic.com/v1
//       https://generativelanguage.googleapis.com/v1beta/openai
// VITE_AI_API_KEY=              → API Key
// VITE_AI_MODEL=                → 模型名称
//   例：gpt-4o / claude-sonnet-4-5 / gemini-2.5-flash
// ============================================================

const USE_MOCK = import.meta.env.VITE_USE_MOCK_AI !== 'false';
const API_URL = import.meta.env.VITE_AI_API_URL;
const API_KEY = import.meta.env.VITE_AI_API_KEY;
const MODEL = import.meta.env.VITE_AI_MODEL || 'gpt-4o';

// ============================================================
// 内部工具：Mock 延迟
// ============================================================
const mockDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================
// 内部工具：调用真实 API（OpenAI 兼容格式）
// ============================================================
const callRealAPI = async (systemPrompt, userContent, maxTokens = 800) => {
  const response = await fetch(`${API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
    }),
  });
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content;
};

// ============================================================
// Mock 数据：社团匹配结果模板
// ============================================================
const MOCK_MATCH_RESULTS = {
  competitive: [
    { matchScore: 94, reason: '你热爱竞技挑战，ACM算法社的高强度训练和比赛氛围非常适合你。', highlights: ['竞赛导向', '技术深度', '时间匹配'] },
    { matchScore: 88, reason: '金融建模社的量化分析挑战和你的学术追求高度契合。', highlights: ['学术氛围', '技能提升', '行业前景'] },
    { matchScore: 72, reason: '篮球社的竞技精神和团队协作能满足你对挑战的渴望。', highlights: ['竞技精神', '团队配合'] },
  ],
  collaborative: [
    { matchScore: 91, reason: '创业者协会注重团队共创，和你期望通过协作成长的目标完全吻合。', highlights: ['团队协作', '项目驱动', '创业思维'] },
    { matchScore: 85, reason: '公益支教团的团队协作氛围让你既能帮助他人，也能交到志同道合的朋友。', highlights: ['有意义', '低门槛', '团队氛围好'] },
    { matchScore: 78, reason: '话剧社的集体排练和演出是团队合作的完美体现。', highlights: ['创意协作', '表达能力'] },
  ],
  casual: [
    { matchScore: 89, reason: '摄影社氛围轻松，每周只需3小时，和你"单纯享受"的目标完美匹配。', highlights: ['时间友好', '创意自由', '无压力'] },
    { matchScore: 83, reason: '街舞社氛围活泼，零基础也能加入，和你轻松参与的期望吻合。', highlights: ['零门槛', '活泼氛围', '享受过程'] },
    { matchScore: 75, reason: '公益支教团参与方式灵活，不会给你造成额外压力。', highlights: ['灵活参与', '有意义'] },
  ],
  creative: [
    { matchScore: 93, reason: '话剧社鼓励创意表达，和你追求创意自由的个性完美契合。', highlights: ['创意发挥', '表演艺术', '个性展示'] },
    { matchScore: 87, reason: '摄影社给你完全的视角自由，用镜头记录属于你的世界。', highlights: ['创作自由', '审美提升', '作品积累'] },
    { matchScore: 80, reason: '街舞社鼓励每个人发展独特风格，是创意与运动的结合。', highlights: ['风格自由', '身体表达'] },
  ],
};

// ============================================================
// Mock 数据：Chatbot 关键词回复映射
// ============================================================
const MOCK_CHAT_REPLIES = [
  {
    keywords: ['技术', '编程', '代码', '开发', '计算机'],
    reply: '技术类社团推荐你看看：\n\n💻 **ACM算法社** — 适合想深耕算法、参加竞赛的同学，每周约8小时，门槛较高但成长快\n\n🚀 **创业者协会** — 更偏产品和商业，适合想做项目的同学，氛围开放友好\n\n哪个方向更吸引你？',
  },
  {
    keywords: ['文艺', '艺术', '创意', '表演', '音乐'],
    reply: '文艺类社团有三个很好的选择：\n\n🎭 **话剧社** — 演技、台词、舞台，每周约6小时\n💃 **街舞社** — 零基础也能加入，氛围超活泼\n📷 **摄影社** — 最轻松，每周只需3小时\n\n你有特别想尝试的吗？',
  },
  {
    keywords: ['时间', '忙', '少', '2小时', '3小时'],
    reply: '时间有限的话，推荐这两个：\n\n📷 **摄影社** — 每周3小时，最轻松，随时可以创作\n❤️ **公益支教团** — 每周4小时，参与方式灵活\n\n这两个都不会给你太大负担，而且很有意义～',
  },
  {
    keywords: ['竞赛', '比赛', '获奖', '奖项'],
    reply: '想拿奖的话，这两个最对口：\n\n💻 **ACM算法社** — 全国性算法竞赛，含金量高\n📊 **金融建模社** — 数学建模比赛，适合有量化基础的同学\n\n不过竞赛社团投入时间比较多，你每周大概能投入多少时间？',
  },
  {
    keywords: ['朋友', '认识', '社交', '人脉'],
    reply: '想认识朋友的话，这几个社团氛围特别好：\n\n🚀 **创业者协会** — 各专业混搭，认识不同背景的人\n❤️ **公益支教团** — 大家都很有爱心，容易有共同话题\n💃 **街舞社** — 活动最多，聚餐轰趴超多机会\n\n你平时比较内向还是外向呢？',
  },
  {
    keywords: ['公益', '志愿', '支教', '帮助'],
    reply: '❤️ **公益支教团**非常适合你！\n\n每周利用周末时间去附近小学支教，教数学、英语或兴趣课。每周约4小时，门槛低，只要有爱心和责任感就可以加入。\n\n他们每学期还会组织一次实地支教活动，体验非常深刻。要报名吗？',
  },
  {
    keywords: ['门槛', '基础', '零基础', '新手', '入门'],
    reply: '零基础完全没问题的社团：\n\n💃 **街舞社** — 有热情就够了，从基础教起\n📷 **摄影社** — 没有相机借社团的也行\n❤️ **公益支教团** — 只要愿意就可以加入\n\n门槛最低的是这三个，你对哪个方向更感兴趣？',
  },
  {
    keywords: ['体育', '运动', '健身', '篮球'],
    reply: '🏀 **篮球社**是你的首选！\n\n有稳定的训练计划，每周2-3次，参加院系联赛。需要有一定篮球基础，喜欢竞技对抗的同学会很爽。\n\n每周约6小时，招新对技术有一定要求，感兴趣可以去试训看看～',
  },
];

const DEFAULT_REPLY = '这个问题很好！建议你先完成「兴趣测试」，我可以根据你的具体情况给出更精准的建议 🎯\n\n或者你可以告诉我你对哪类活动感兴趣（技术/文艺/体育/公益），我来帮你推荐～';

// ============================================================
// Mock 数据：自我介绍模板（按社团类别）
// ============================================================
const INTRO_TEMPLATES = {
  技术: '你好！我是{name}，目前就读于{major}专业。我对编程和技术有浓厚兴趣，平时喜欢刷算法题和做项目。看到{club}的招新信息后非常心动，相信能在这里和志同道合的伙伴一起成长，也希望通过参与竞赛提升自己的技术水平。每周我可以投入约{hours}小时，期待加入！',
  文艺: '你好！我是{name}，对艺术和创意表达有着持续的热情。{club}的活动风格和作品让我印象深刻，我相信这里是一个让我发挥创意的好地方。我愿意全情投入每周的活动，期待和大家一起创作出精彩的作品！',
  体育: '你好！我是{name}，从小就热爱运动。加入{club}是我进入大学后最期待的事之一，希望能在这里继续磨练技术，和队友一起在赛场上拼搏。我每周可以保证足够的训练时间，期待试训机会！',
  公益: '你好！我是{name}，进入大学后一直在寻找能做有意义的事的机会。{club}的理念深深打动了我——我相信每个孩子都值得获得好的教育资源。我愿意贡献自己的时间和耐心，期待成为团队的一员！',
  学术: '你好！我是{name}，对{club}涉及的领域有浓厚的学习热情。我希望通过参与社团的项目和比赛，将理论知识与实践结合，同时向经验丰富的学长学姐学习。期待能和大家一起探索！',
};

// ============================================================
// 导出函数 1：社团匹配推荐
// ============================================================
export const matchClubs = async (profile, clubs) => {
  if (USE_MOCK) {
    await mockDelay(1200); // 稍长，模拟AI计算时间

    const vibe = profile.vibe || 'collaborative';
    const templates = MOCK_MATCH_RESULTS[vibe] || MOCK_MATCH_RESULTS.collaborative;

    // 根据 vibe 排序社团，前3个用模板分数，其余随机
    const shuffled = [...clubs].sort((a, b) => {
      if (a.vibe === vibe && b.vibe !== vibe) return -1;
      if (b.vibe === vibe && a.vibe !== vibe) return 1;
      return 0;
    });

    return shuffled.map((club, i) => ({
      clubId: club.id,
      matchScore: templates[i]?.matchScore ?? Math.floor(Math.random() * 30 + 55),
      reason: templates[i]?.reason ?? `${club.name}和你的兴趣有不少共同点，值得深入了解。`,
      highlights: templates[i]?.highlights ?? ['兴趣匹配', '时间合适'],
    }));
  }

  // 真实 API 模式
  const systemPrompt = `你是大学社团匹配助手。根据新生画像推荐最适合的社团。
必须返回合法JSON数组，格式：[{"clubId":"","matchScore":0-100,"reason":"2-3句话","highlights":["标签1","标签2"]}]
不要有任何额外文字。`;

  const userContent = `新生画像: ${JSON.stringify(profile)}
社团列表: ${JSON.stringify(clubs.map(c => ({ id: c.id, name: c.name, category: c.category, tags: c.tags, requirements: c.requirements, weeklyHours: c.weeklyHours, vibe: c.vibe })))}
推荐全部${clubs.length}个社团，按匹配度降序排列。`;

  const raw = await callRealAPI(systemPrompt, userContent, 1500);
  const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned);
};

// ============================================================
// 导出函数 2：Chatbot 对话
// ============================================================
export const chatWithAssistant = async (messages, clubs) => {
  if (USE_MOCK) {
    await mockDelay(600);
    const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || '';

    // 关键词匹配
    for (const item of MOCK_CHAT_REPLIES) {
      if (item.keywords.some(kw => lastUserMsg.includes(kw))) {
        return item.reply;
      }
    }
    return DEFAULT_REPLY;
  }

  // 真实 API 模式
  const clubSummary = clubs.map(c =>
    `${c.name}（${c.category}）：${c.description.slice(0, 50)}，标签：${c.tags.join('/')}`
  ).join('\n');

  const systemPrompt = `你是ClubMatch平台的AI助手"小Match"，帮助大学新生了解和选择社团。
语气活泼、友好，像学长学姐一样真诚。回答控制在150字以内。
社团信息：\n${clubSummary}`;

  const apiMessages = messages.map(m => ({ role: m.role, content: m.content }));

  const response = await fetch(`${API_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify({ model: MODEL, max_tokens: 400, messages: [{ role: 'system', content: systemPrompt }, ...apiMessages] }),
  });
  const data = await response.json();
  return data.choices[0].message.content;
};

// ============================================================
// 导出函数 3：AI 自我介绍生成
// ============================================================
export const generateIntro = async (profile, club) => {
  if (USE_MOCK) {
    await mockDelay(800);
    const template = INTRO_TEMPLATES[club.category] || INTRO_TEMPLATES['学术'];
    return template
      .replace('{name}', '我')
      .replace('{major}', '计算机科学')
      .replace('{club}', club.name)
      .replace('{hours}', profile.timeAvailable || 5);
  }

  // 真实 API 模式
  const systemPrompt = `帮助大学生写社团报名自我介绍。要求：简短真诚，150字以内，突出与社团需求的匹配点，语气热情但不浮夸。`;
  const userContent = `社团：${club.name}（${club.category}）
社团需求：${club.requirements?.join('、')}
申请人背景：兴趣${profile.interests?.join('、')}，技能${profile.skills?.join('、')}，每周可投入${profile.timeAvailable}小时，期望${profile.goals?.join('、')}
请生成自我介绍：`;

  return await callRealAPI(systemPrompt, userContent, 300);
};
```

---

## 打字机效果 Hook

```js
// src/hooks/useTypewriter.js
import { useState, useEffect } from 'react';

export const useTypewriter = (text, speed = 18, enabled = true) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayed(text || '');
      setDone(true);
      return;
    }
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, ++i));
      } else {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, enabled]);

  return { displayed, done };
};
```

---

## .env 文件模板

```bash
# .env（放在项目根目录，不要提交到 git）

# AI 模式切换（true = Mock演示模式，false = 真实AI模式）
VITE_USE_MOCK_AI=true

# 真实AI配置（VITE_USE_MOCK_AI=false时生效）
# 填入任意兼容OpenAI格式的服务商即可

# 示例1：OpenAI
# VITE_AI_API_URL=https://api.openai.com/v1
# VITE_AI_API_KEY=sk-...
# VITE_AI_MODEL=gpt-4o

# 示例2：Anthropic Claude
# VITE_AI_API_URL=https://api.anthropic.com/v1
# VITE_AI_API_KEY=sk-ant-...
# VITE_AI_MODEL=claude-sonnet-4-5

# 示例3：Google Gemini (OpenAI兼容接口)
# VITE_AI_API_URL=https://generativelanguage.googleapis.com/v1beta/openai
# VITE_AI_API_KEY=AIza...
# VITE_AI_MODEL=gemini-2.5-flash
```
