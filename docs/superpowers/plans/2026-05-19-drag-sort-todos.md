# Drag Sort Todos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add native drag-and-drop sorting for todo items and persist the user-defined order.

**Architecture:** Extract pure ordering helpers into `js/todoOrdering.js` so sorting and reordering can be tested with Node's built-in test runner. Wire those helpers into `js/main.js` for migration, rendering order, and drop handling. Add CSS feedback for draggable, dragging, and drop-target states.

**Tech Stack:** HTML, CSS, JavaScript modules, localStorage, Node `node:test`, Vite.

---

### Task 1: Ordering Helpers

**Files:**
- Create: `js/todoOrdering.js`
- Create: `tests/ordering.test.mjs`

- [ ] **Step 1: Write failing tests**

Create tests for `ensureTodoOrder`, `sortTodosByOrder`, and `reorderVisibleTodos`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`

Expected: ordering tests fail because `js/todoOrdering.js` does not exist.

- [ ] **Step 3: Implement ordering helpers**

Create `js/todoOrdering.js` with pure functions that clone todo objects when assigning order, sort by `order`, and merge a reordered visible subset back into the full list.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`

Expected: all tests pass.

### Task 2: UI Drag Wiring

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Import helpers and migrate loaded todos**

Use `ensureTodoOrder` with the existing automatic sort comparator when loading state.

- [ ] **Step 2: Render visible todos by stored order**

Replace the current computed sort in `getVisibleTodos()` with `sortTodosByOrder`.

- [ ] **Step 3: Add drag event handlers**

Make non-editing todo items draggable, track the dragged id, highlight drop targets, call `reorderVisibleTodos`, save, and re-render on drop.

- [ ] **Step 4: Run tests**

Run: `npm test`

Expected: all tests pass.

### Task 3: Drag Styling And Build Verification

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Add drag feedback styles**

Add cursor, opacity, and drop-target styles that match the current paper-like todo item design.

- [ ] **Step 2: Run final verification**

Run: `npm test`

Expected: all tests pass.

Run: `npm run build`

Expected: Vite build exits successfully.
