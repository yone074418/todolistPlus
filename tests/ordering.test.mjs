import test from "node:test";
import assert from "node:assert/strict";

import { ensureTodoOrder, reorderVisibleTodos, sortTodosByOrder } from "../js/todoOrdering.js";

test("assigns missing todo order from the provided initial sort", () => {
  const todos = [
    { id: 1, title: "Low", priority: "low" },
    { id: 2, title: "High", priority: "high" },
    { id: 3, title: "Medium", priority: "medium", order: 7 },
  ];

  const orderedTodos = ensureTodoOrder(todos, (a, b) => a.priority.localeCompare(b.priority));

  assert.deepEqual(
    orderedTodos.map((todo) => [todo.id, todo.order]),
    [
      [2, 0],
      [1, 1],
      [3, 7],
    ],
  );
  assert.equal(todos[0].order, undefined);
});

test("sorts todos by stored order with id as a stable fallback", () => {
  const todos = [
    { id: 3, title: "Third", order: 2 },
    { id: 1, title: "First", order: 0 },
    { id: 2, title: "Second", order: 1 },
  ];

  assert.deepEqual(
    sortTodosByOrder(todos).map((todo) => todo.id),
    [1, 2, 3],
  );
});

test("reorders the visible subset while preserving hidden todo positions", () => {
  const todos = [
    { id: 1, title: "Visible A", order: 0 },
    { id: 2, title: "Hidden", order: 1 },
    { id: 3, title: "Visible B", order: 2 },
    { id: 4, title: "Visible C", order: 3 },
  ];
  const visibleTodos = [todos[0], todos[2], todos[3]];

  const reorderedTodos = reorderVisibleTodos(todos, visibleTodos, 4, 1);

  assert.deepEqual(
    sortTodosByOrder(reorderedTodos).map((todo) => todo.id),
    [4, 2, 1, 3],
  );
  assert.deepEqual(
    reorderedTodos.map((todo) => [todo.id, todo.order]),
    [
      [1, 2],
      [2, 1],
      [3, 3],
      [4, 0],
    ],
  );
});

test("moves a visible todo before a later visible target", () => {
  const todos = [
    { id: 1, title: "First", order: 0 },
    { id: 2, title: "Second", order: 1 },
    { id: 3, title: "Third", order: 2 },
  ];

  const reorderedTodos = reorderVisibleTodos(todos, todos, 1, 3);

  assert.deepEqual(
    sortTodosByOrder(reorderedTodos).map((todo) => todo.id),
    [2, 1, 3],
  );
});
