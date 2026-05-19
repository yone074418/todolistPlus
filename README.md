# todolistPlus

一个 Vite 驱动的纯前端个人待办事项应用，使用原生 HTML、CSS、JavaScript 和 `localStorage` 实现。当前版本适合日常任务记录、筛选、搜索、手动排序和夜间使用。

## 已实现

- 快速添加任务，支持 Enter 提交和空内容校验
- 添加任务时选择高 / 中 / 低优先级，默认中优先级
- 添加任务时必须选择截止日期，且日期不能早于当天
- 任务列表展示标题、优先级、截止日期、创建时间和逾期状态
- 切换完成状态、删除任务、行内编辑任务标题
- 全部 / 未完成 / 已完成筛选
- 根据任务标题实时搜索
- 拖拽当前可见任务调整顺序，并保存排序结果
- 顶部显示全部、未完成、已完成任务统计
- 点击按钮切换夜晚模式，主题偏好保存到 `localStorage`
- 空状态、表单消息和响应式布局
- 使用 `node:test` 覆盖搜索、排序和主题工具函数

## 暂未实现

- 分类管理
- 任务备注
- 数据导出
- 后端同步、登录和多设备同步

## 项目结构

```text
todolistPlus/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── themeMode.js
│   ├── todoOrdering.js
│   └── todoSearch.js
├── tests/
│   ├── ordering.test.mjs
│   ├── search.test.mjs
│   └── themeMode.test.mjs
├── AGENTS.md
├── PRD.md
├── TECH_DESIGN.md
└── package.json
```

## 开发命令

```bash
npm install
npm run dev
```

## 测试命令

```bash
npm test
```

## 构建命令

```bash
npm run build
```

## 预览构建产物

```bash
npm run preview
```
