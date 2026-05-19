# AGENTS.md

## 项目状态

`todolistPlus` 当前是一个 Vite 驱动的纯前端个人待办事项应用，使用原生 HTML、CSS、JavaScript 和 `localStorage`，没有后端、数据库或前端框架。

## 已落地功能

- 添加待办事项，支持 Enter 提交和空内容校验
- 添加任务时选择优先级：`high`、`medium`、`low`
- 添加任务时必须选择截止日期，且日期不能早于当天
- 列表展示标题、优先级、截止日期、创建时间和逾期状态
- 切换完成状态、删除任务、行内编辑任务标题
- 按全部、未完成、已完成筛选
- 根据任务标题进行实时搜索
- 拖拽当前可见任务调整顺序，顺序保存到本地
- 顶部统计全部、未完成、已完成数量
- 点击按钮切换夜晚模式，并保存主题偏好
- 空状态、表单消息和响应式布局
- 搜索、排序与主题逻辑已有 `node:test` 单元测试

## 技术栈

- HTML：页面结构，入口文件是 `index.html`
- CSS：页面视觉、优先级视觉、拖拽态、夜晚模式和响应式布局，样式文件是 `css/style.css`
- JavaScript modules：页面交互和工具函数
- localStorage：保存任务数据和主题偏好
- Vite：本地开发、构建和预览
- node:test：轻量单元测试

## 目录说明

```text
index.html              页面结构和 DOM 挂载点
css/style.css           页面样式、优先级视觉、拖拽态、夜晚模式和响应式布局
js/main.js              应用主逻辑、DOM 事件、localStorage、主题切换和渲染
js/themeMode.js         主题读取、切换和判断工具函数
js/todoSearch.js        任务标题搜索工具函数
js/todoOrdering.js      初始化排序、按 order 排序、拖拽重排工具函数
tests/search.test.mjs   搜索逻辑测试
tests/ordering.test.mjs 排序和拖拽重排逻辑测试
tests/themeMode.test.mjs 主题逻辑测试
README.md               用户和仓库首页说明
PRD.md                  产品需求说明
TECH_DESIGN.md          技术设计说明
```

## 数据模型

任务对象当前包含以下字段：

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

字段含义：

| 字段 | 类型 | 说明 |
|---|---|---|
| id | Number | 任务唯一编号，当前由 `Date.now()` 生成 |
| title | String | 任务标题 |
| completed | Boolean | 是否完成 |
| priority | String | 任务优先级，取值为 `high`、`medium`、`low` |
| dueDate | String | 截止日期，格式为 `YYYY-MM-DD` |
| createdAt | String | 创建时间展示文本 |
| order | Number | 手动排序顺序 |

任务数据保存在 `localStorage` 的 `todoList` 键中。主题偏好保存在 `localStorage` 的 `todoTheme` 键中，取值为 `light` 或 `dark`。

## 开发约定

- 用户输入内容必须 `trim()` 后再保存。
- 渲染用户输入时使用 `textContent`，不要用 `innerHTML` 拼接用户内容。
- 修改任务数据后必须调用保存逻辑并重新渲染。
- 新增可复用业务逻辑时优先放到独立模块，并为纯函数补充 `node:test` 测试。
- 保持功能轻量，避免引入框架、后端或复杂状态管理，除非需求明确升级。
- 样式应延续当前纸张感、低饱和、8px 圆角和响应式布局风格。

## 常用命令

```bash
npm install
npm run dev
npm test
npm run build
npm run preview
```

## 后续可扩展方向

- 分类管理
- 任务备注
- 数据导出
- 后端同步、登录和多设备同步
