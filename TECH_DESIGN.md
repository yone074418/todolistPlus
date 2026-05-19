# TECH_DESIGN

## 1. 技术栈

本项目第一版已经完成，采用轻量纯前端实现：

| 技术 | 作用 |
|---|---|
| HTML | 页面结构 |
| CSS | 页面样式、响应式布局和交互状态 |
| JavaScript modules | 页面交互、渲染、搜索和排序逻辑 |
| localStorage | 浏览器本地保存任务数据 |
| Vite | 本地开发、构建和预览 |
| node:test | 单元测试 |

MVP 阶段不使用后端和数据库。任务数据保存在浏览器本地，适合个人单设备使用。

## 2. 项目结构

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
├── AGENTS.md
├── README.md
├── PRD.md
├── TECH_DESIGN.md
└── package.json
```

## 3. 模块职责

| 文件 | 作用 |
|---|---|
| `index.html` | 页面结构、表单、筛选区、搜索框、统计区和任务列表容器 |
| `css/style.css` | 页面视觉、优先级状态、逾期状态、拖拽态和移动端适配 |
| `js/main.js` | 应用主逻辑、DOM 事件、数据读写、任务渲染和路由兜底 |
| `js/todoSearch.js` | 根据标题过滤任务的纯函数 |
| `js/todoOrdering.js` | 初始化 order、按 order 排序、拖拽重排可见任务 |
| `tests/*.test.mjs` | 搜索和排序逻辑测试 |

## 4. 数据模型

任务列表保存在 `localStorage` 的 `todoList` 键中。每条任务结构如下：

```js
{
  id: 1716019200000,
  title: "完成待办事项页面",
  completed: false,
  priority: "medium",
  dueDate: "2026-05-19",
  createdAt: "2026-05-19 13:00",
  order: 0
}
```

| 字段 | 类型 | 说明 |
|---|---|---|
| id | Number | 任务唯一编号，当前使用 `Date.now()` |
| title | String | 任务标题 |
| completed | Boolean | 是否完成 |
| priority | String | 优先级，取值为 `high`、`medium`、`low` |
| dueDate | String | 截止日期，格式为 `YYYY-MM-DD` |
| createdAt | String | 创建时间展示文本 |
| order | Number | 手动排序顺序 |

## 5. 关键流程

### 5.1 初始化

```text
读取 localStorage
↓
解析任务数组
↓
为历史任务补齐 order
↓
保存补齐后的数据
↓
渲染当前筛选和搜索结果
```

### 5.2 添加任务

```text
提交表单
↓
校验标题非空
↓
校验截止日期已选择
↓
创建任务对象并写入 order
↓
保存 localStorage
↓
重新渲染列表和统计
```

### 5.3 展示任务

列表先按状态筛选，再按标题搜索，最后根据 `order` 排序。每个列表项显示：

- 完成复选框
- 任务标题
- 优先级标签
- 截止日期和逾期标记
- 创建时间
- 编辑和删除按钮

### 5.4 搜索和筛选

筛选由 `currentFilter` 控制，支持 `all`、`active`、`completed`。搜索由 `currentSearchQuery` 控制，使用 `filterTodosBySearch()` 只匹配任务标题。

### 5.5 拖拽排序

拖拽排序只作用于当前可见任务。`reorderVisibleTodos()` 会在保持隐藏任务相对位置的基础上重排可见任务，并重新分配 `order`。

### 5.6 本地存储

所有新增、编辑、删除、完成状态切换和拖拽排序都会写回 `localStorage`：

```js
localStorage.setItem("todoList", JSON.stringify(todoList));
```

读取时有异常兜底，解析失败会返回空数组。

## 6. UI 和可用性

- 页面主体居中，最大宽度约 940px。
- 桌面端添加区域采用输入框、优先级、截止日期、添加按钮的横向布局。
- 移动端表单、统计和任务操作会自动堆叠。
- 高、中、低优先级使用不同左边框和标签颜色。
- 已完成任务降低透明度并给标题添加删除线。
- 逾期未完成任务使用醒目的截止日期样式。
- 空列表展示友好空状态。

## 7. 安全和维护约定

- 用户输入必须 `trim()`。
- 渲染用户输入必须使用 `textContent`。
- 避免通过字符串拼接生成包含用户内容的 HTML。
- 业务纯函数优先放入 `js/` 下的独立模块。
- 新增搜索、排序、数据迁移等纯逻辑时补充 `node:test`。
- 第一版保持轻量，不引入框架、登录、后端或复杂状态管理。

## 8. 测试

当前测试覆盖：

- 搜索关键字匹配任务标题
- 空搜索返回全部任务
- 历史任务补齐 `order`
- 按 `order` 稳定排序
- 拖拽可见任务时保留隐藏任务位置

运行命令：

```bash
npm test
```

构建命令：

```bash
npm run build
```
