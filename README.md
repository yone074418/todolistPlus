# todolistPlus

一个纯前端个人待办事项页面，使用 HTML、CSS、JavaScript、Vite 和 localStorage 实现。第一版已经完成，可用于日常任务记录、筛选、搜索和手动排序。

## 已实现

- 快速添加任务，支持 Enter 提交
- 添加任务时选择高 / 中 / 低优先级，默认中优先级
- 添加任务时必须选择截止日期，任务列表展示截止日期和逾期状态
- 任务列表展示、完成状态切换、删除任务
- 行内编辑任务标题，支持保存和取消
- 全部 / 未完成 / 已完成筛选
- 根据任务标题实时搜索
- 拖拽可见任务进行手动排序，并保存排序结果
- 顶部展示全部、未完成、已完成任务统计
- localStorage 本地保存，刷新后数据保留
- 空状态和表单校验提示
- 桌面端和移动端响应式布局
- 使用 `node:test` 覆盖搜索和排序工具函数

## 暂未实现

- 分类管理
- 任务备注
- 深色模式
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
│   ├── todoOrdering.js
│   └── todoSearch.js
├── tests/
│   ├── ordering.test.mjs
│   └── search.test.mjs
├── PRD.md
├── TECH_DESIGN.md
├── AGENTS.md
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
