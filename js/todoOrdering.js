export function ensureTodoOrder(todos, initialSort) {
  const sortedTodos = [...todos].sort((a, b) => {
    const aHasOrder = Number.isFinite(a.order);
    const bHasOrder = Number.isFinite(b.order);

    if (aHasOrder && bHasOrder) {
      return a.order - b.order || a.id - b.id;
    }

    if (aHasOrder !== bHasOrder) {
      return aHasOrder ? 1 : -1;
    }

    return initialSort(a, b);
  });

  let nextOrder = 0;

  return sortedTodos.map((todo) => {
    if (Number.isFinite(todo.order)) {
      nextOrder = Math.max(nextOrder, todo.order + 1);
      return todo;
    }

    return { ...todo, order: nextOrder++ };
  });
}

export function sortTodosByOrder(todos) {
  return [...todos].sort((a, b) => {
    const orderDifference = getTodoOrder(a) - getTodoOrder(b);
    return orderDifference || a.id - b.id;
  });
}

export function reorderVisibleTodos(todos, visibleTodos, draggedId, targetId) {
  if (draggedId === targetId) {
    return todos;
  }

  const visibleIds = visibleTodos.map((todo) => todo.id);
  const draggedIndex = visibleIds.indexOf(draggedId);
  const targetIndex = visibleIds.indexOf(targetId);

  if (draggedIndex === -1 || targetIndex === -1) {
    return todos;
  }

  const reorderedVisibleIds = [...visibleIds];
  const [draggedVisibleId] = reorderedVisibleIds.splice(draggedIndex, 1);
  const insertionIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
  reorderedVisibleIds.splice(insertionIndex, 0, draggedVisibleId);

  const visibleIdSet = new Set(visibleIds);
  const visibleIdQueue = [...reorderedVisibleIds];
  const sortedTodos = sortTodosByOrder(todos);
  const nextOrderById = new Map();

  sortedTodos.forEach((todo, index) => {
    const nextId = visibleIdSet.has(todo.id) ? visibleIdQueue.shift() : todo.id;
    nextOrderById.set(nextId, index);
  });

  return todos.map((todo) => ({ ...todo, order: nextOrderById.get(todo.id) }));
}

function getTodoOrder(todo) {
  return Number.isFinite(todo.order) ? todo.order : Number.MAX_SAFE_INTEGER;
}
