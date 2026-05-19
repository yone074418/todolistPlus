export function filterTodosBySearch(todos, searchQuery) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (!normalizedQuery) {
    return todos;
  }

  return todos.filter((todo) => todo.title.toLowerCase().includes(normalizedQuery));
}
