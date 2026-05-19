import { filterTodosBySearch } from "./todoSearch.js";

const STORAGE_KEY = "todoList";
const priorityOrder = {
  high: 1,
  medium: 2,
  low: 3,
};
const priorityLabels = {
  high: "高",
  medium: "中",
  low: "低",
};

const todoForm = document.querySelector("#todo-form");
const todoTitleInput = document.querySelector("#todo-title");
const todoPrioritySelect = document.querySelector("#todo-priority");
const todoDueDateInput = document.querySelector("#todo-due-date");
const todoSearchInput = document.querySelector("#todo-search");
const todoListElement = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const formMessage = document.querySelector("#form-message");
const filterButtons = document.querySelectorAll(".filter-button");
const totalCount = document.querySelector("#total-count");
const activeCount = document.querySelector("#active-count");
const completedCount = document.querySelector("#completed-count");
const listSummary = document.querySelector("#list-summary");

let todoList = loadTodos();
let currentFilter = "all";
let currentSearchQuery = "";
let editingTodoId = null;

const routes = {
  "/": renderTodos,
  "/todos": renderTodos,
};

function loadTodos() {
  try {
    const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedTodos) ? savedTodos : [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todoList));
}

function getFormattedTime() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return formatter.format(now).replace(/\//g, "-");
}

function getTodayDateValue() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function formatDueDate(dueDate) {
  if (!dueDate) {
    return "未设置截止日期";
  }

  return `截止 ${dueDate}`;
}

function isOverdue(todo) {
  return Boolean(todo.dueDate && !todo.completed && todo.dueDate < getTodayDateValue());
}

function getVisibleTodos() {
  const filteredTodos = todoList.filter((todo) => {
    if (currentFilter === "active") {
      return !todo.completed;
    }

    if (currentFilter === "completed") {
      return todo.completed;
    }

    return true;
  });

  const searchedTodos = filterTodosBySearch(filteredTodos, currentSearchQuery);

  return [...searchedTodos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return Number(a.completed) - Number(b.completed);
    }

    const priorityDifference = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) {
      return a.dueDate.localeCompare(b.dueDate);
    }

    if (a.dueDate !== b.dueDate) {
      return a.dueDate ? -1 : 1;
    }

    return b.id - a.id;
  });
}

function renderTodos() {
  todoListElement.replaceChildren();

  const visibleTodos = getVisibleTodos();
  emptyState.hidden = visibleTodos.length > 0;
  updateStats(visibleTodos.length);

  visibleTodos.forEach((todo) => {
    todoListElement.append(createTodoItem(todo));
  });
}

function createTodoItem(todo) {
  const item = document.createElement("li");
  item.className = `todo-item priority-${todo.priority}`;
  item.dataset.id = todo.id;

  if (todo.completed) {
    item.classList.add("completed");
  }

  if (isOverdue(todo)) {
    item.classList.add("overdue");
  }

  const checkbox = document.createElement("input");
  checkbox.className = "todo-checkbox";
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.setAttribute("aria-label", `切换任务状态：${todo.title}`);
  checkbox.addEventListener("change", () => toggleTodo(todo.id));

  item.append(checkbox);

  if (editingTodoId === todo.id) {
    item.append(createEditForm(todo), createActions(todo, true));
    return item;
  }

  const content = document.createElement("div");
  content.className = "todo-content";

  const title = document.createElement("p");
  title.className = "todo-title";
  title.textContent = todo.title;

  const meta = document.createElement("div");
  meta.className = "todo-meta";

  const priorityTag = document.createElement("span");
  priorityTag.className = `priority-tag priority-${todo.priority}`;
  priorityTag.textContent = `${priorityLabels[todo.priority]}优先级`;

  const createdAt = document.createElement("span");
  createdAt.textContent = todo.createdAt;

  const dueDate = document.createElement("span");
  dueDate.className = "due-date";
  dueDate.textContent = formatDueDate(todo.dueDate);

  if (isOverdue(todo)) {
    dueDate.classList.add("overdue");
    dueDate.textContent = `${formatDueDate(todo.dueDate)} · 已逾期`;
  }

  meta.append(priorityTag, dueDate, createdAt);
  content.append(title, meta);
  item.append(content, createActions(todo, false));

  return item;
}

function createActions(todo, isEditing) {
  const actions = document.createElement("div");
  actions.className = "todo-actions";

  if (isEditing) {
    const saveButton = document.createElement("button");
    saveButton.className = "action-button";
    saveButton.type = "button";
    saveButton.textContent = "保存";
    saveButton.addEventListener("click", () => saveEditedTodo(todo.id));

    const cancelButton = document.createElement("button");
    cancelButton.className = "action-button";
    cancelButton.type = "button";
    cancelButton.textContent = "取消";
    cancelButton.addEventListener("click", cancelEditing);

    actions.append(saveButton, cancelButton);
    return actions;
  }

  const editButton = document.createElement("button");
  editButton.className = "action-button";
  editButton.type = "button";
  editButton.textContent = "编辑";
  editButton.addEventListener("click", () => startEditing(todo.id));

  const deleteButton = document.createElement("button");
  deleteButton.className = "action-button delete";
  deleteButton.type = "button";
  deleteButton.textContent = "删除";
  deleteButton.addEventListener("click", () => deleteTodo(todo.id));

  actions.append(editButton, deleteButton);
  return actions;
}

function createEditForm(todo) {
  const editForm = document.createElement("form");
  editForm.className = "edit-form";
  editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveEditedTodo(todo.id);
  });

  const editInput = document.createElement("input");
  editInput.className = "edit-input";
  editInput.type = "text";
  editInput.value = todo.title;
  editInput.maxLength = 80;
  editInput.setAttribute("aria-label", "编辑任务标题");

  requestAnimationFrame(() => {
    editInput.focus();
    editInput.select();
  });

  editForm.append(editInput);
  return editForm;
}

function addTodo(event) {
  event.preventDefault();

  const title = todoTitleInput.value.trim();
  if (!title) {
    showMessage("请输入任务内容后再添加。");
    return;
  }

  if (!todoDueDateInput.value) {
    showMessage("请选择任务的截止日期。");
    todoDueDateInput.focus();
    return;
  }

  todoList.push({
    id: Date.now(),
    title,
    completed: false,
    priority: todoPrioritySelect.value,
    dueDate: todoDueDateInput.value,
    createdAt: getFormattedTime(),
  });

  todoTitleInput.value = "";
  todoPrioritySelect.value = "medium";
  todoDueDateInput.value = "";
  showMessage("");
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todoList = todoList.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo,
  );
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todoList = todoList.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function startEditing(id) {
  editingTodoId = id;
  showMessage("");
  renderTodos();
}

function saveEditedTodo(id) {
  const item = todoListElement.querySelector(`[data-id="${id}"]`);
  const editInput = item?.querySelector(".edit-input");
  const title = editInput?.value.trim();

  if (!title) {
    showMessage("任务内容不能为空。");
    return;
  }

  todoList = todoList.map((todo) => (todo.id === id ? { ...todo, title } : todo));
  editingTodoId = null;
  showMessage("");
  saveTodos();
  renderTodos();
}

function cancelEditing() {
  editingTodoId = null;
  showMessage("");
  renderTodos();
}

function setFilter(filter) {
  currentFilter = filter;
  editingTodoId = null;

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderTodos();
}

function setSearchQuery(query) {
  currentSearchQuery = query;
  editingTodoId = null;
  renderTodos();
}

function showMessage(message) {
  formMessage.textContent = message;
}

function updateStats(visibleCount) {
  const completedTodos = todoList.filter((todo) => todo.completed).length;
  const activeTodos = todoList.length - completedTodos;

  totalCount.textContent = String(todoList.length);
  activeCount.textContent = String(activeTodos);
  completedCount.textContent = String(completedTodos);

  if (currentFilter === "active") {
    listSummary.textContent = `当前显示 ${visibleCount} 条未完成任务`;
    return;
  }

  if (currentFilter === "completed") {
    listSummary.textContent = `当前显示 ${visibleCount} 条已完成任务`;
    return;
  }

  listSummary.textContent = todoList.length
    ? `还有 ${activeTodos} 条任务待完成`
    : "暂无任务";
}

function getRoutePath() {
  return window.location.hash.replace("#", "") || "/";
}

function handleRouteChange() {
  const routePath = getRoutePath();
  const renderPage = routes[routePath] || routes["/"];
  renderPage();
}

todoForm.addEventListener("submit", addTodo);
todoSearchInput.addEventListener("input", (event) => setSearchQuery(event.target.value));
window.addEventListener("hashchange", handleRouteChange);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

todoDueDateInput.min = getTodayDateValue();
setFilter(currentFilter);
