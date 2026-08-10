# 罗叶子 · 个人作品集

暗色系个人作品集（React + Vite），版心约 1700px。

## 页面结构

1. **个人经历**（页首，对齐设计稿）— 头像、介绍、数据、底部联系条
2. **能力介绍**（按简历能力维度展开）
   - 01 结构设计能力：左图右文
   - 02 信号处理与故障诊断：右图左文
   - 03 仿真分析能力：左图右文
   - 04 学科交叉设计能力：卡片网格，点击展开详情
3. **联系** — 整屏收尾

## 启动

```bash
cd "C:\Users\Lenovo\Documents\个人作品集"
npm install
npm run dev
```

## 替换素材

| 资源 | 路径 |
|------|------|
| 头像 | `public/images/avatar.png` |
| 能力 01–03 封面 | `public/images/projects/ability-1.png` ~ `ability-3.png` |
| 学科交叉卡片 | `public/images/projects/cross-1.png` ~ `cross-4.png` |

文案与联系方式：`src/content/portfolio.js`
