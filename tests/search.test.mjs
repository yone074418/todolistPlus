import test from "node:test";
import assert from "node:assert/strict";

import { filterTodosBySearch } from "../js/todoSearch.js";

test("filters todos by characters typed from the todo title", () => {
  const todos = [
    { title: "买牛奶", completed: false },
    { title: "完成数学作业", completed: false },
    { title: "整理书桌", completed: true },
  ];

  assert.deepEqual(filterTodosBySearch(todos, "数"), [{ title: "完成数学作业", completed: false }]);
});

test("returns every todo when the search query is blank", () => {
  const todos = [
    { title: "买牛奶", completed: false },
    { title: "完成数学作业", completed: false },
  ];

  assert.deepEqual(filterTodosBySearch(todos, "   "), todos);
});
