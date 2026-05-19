# Drag Sort Todos Design

## Goal

Users can reorder todo items directly on the page by dragging them, and the chosen order is preserved in localStorage.

## Current Context

The app stores todos in the `todoList` localStorage key and renders visible items from `js/main.js`. The current display order is computed from completion state, priority, due date, and id. That computed order would override any manual drag result unless the data model stores an explicit user order.

## Recommended Approach

Add an `order` field to each todo. `getVisibleTodos()` will filter and search todos, then sort by `order`. Existing todos without `order` will be migrated on load by applying the current automatic sort as their initial order, so old data keeps a familiar first display.

Drag and drop will use native browser HTML drag events. Each rendered non-editing todo item will be draggable, carry its todo id in `dataTransfer`, and accept drops from other todo items. On drop, the app will reorder the backing `todoList` according to the currently visible list, recompute contiguous `order` values, save to localStorage, and re-render.

## Interaction Details

- Dragging works in all filters and search results.
- Hidden todos keep their relative order.
- Dropping one visible todo before another visible todo updates the full todo order without losing hidden items.
- Editing mode disables dragging for the edited item to avoid conflicts with text input.
- Dragging has visible feedback through CSS classes.

## Testing

Add focused tests for pure ordering helpers:

- Migrating todos assigns stable `order` values.
- Reordering a visible subset moves one todo before another while preserving hidden todos.
- Sorting visible todos respects stored `order`.

Run `npm test` and `npm run build` after implementation.
