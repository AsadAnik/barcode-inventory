"use client";

import React, { useState } from "react";

const initialColumns = {
  Uncategorized: [],
  "In Progress": [],
  Completed: [],
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState<typeof initialColumns>(initialColumns);
  const [newItem, setNewItem] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // region Add New Category
  const addNewCategory = () => {
    if (newCategory.trim() && !columns.hasOwnProperty(newCategory.trim())) {
      setColumns((prev) => ({ ...prev, [newCategory.trim()]: [] }));
      setNewCategory("");
    }
  };

  // region Drag Start
  const handleDragStart = (e: React.DragEvent, item: string, from: string) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ item, from }));
  };

  // region Drag Over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Allow drop
  };

  // region Drop Over
  const handleDrop = (e: React.DragEvent, to: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    const { item, from } = JSON.parse(data);

    setColumns((prev) => {
      const newColumns = { ...prev };

      // Remove from source and add to destination
      newColumns[from as keyof typeof initialColumns] = newColumns[from as keyof typeof initialColumns].filter((i) => i !== item);
      (newColumns[to as keyof typeof initialColumns] as string[]).push(item);
      return newColumns;
    });
  };

  // region Add New Item
  const addNewItem = () => {
    if (newItem.trim()) {
      setColumns((prev: any) => ({
        ...prev,
        Uncategorized: [...prev.Uncategorized, newItem] as string[],
      }));
      setNewItem("");
    }
  };

  // region UI
  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
      <div className="mb-6">
        {/* Add new item input */}
        <input
          type="text"
          placeholder="Add new item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button onClick={addNewItem} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          Add Item
        </button>
        {/* Add new category input */}
        <input
          type="text"
          placeholder="Add new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button onClick={addNewCategory} className="bg-green-500 text-white px-4 py-2 rounded">
          Add Category
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(columns).map(([columnName, items]) => (
          <div
            key={columnName}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, columnName)}
            className="bg-white rounded shadow p-4 min-h-[200px]"
          >
            <h2 className="text-xl font-semibold mb-4">{columnName}</h2>
            {items.map((item) => (
              <div
                key={item}
                draggable
                onDragStart={(e) => handleDragStart(e, item, columnName)}
                className="bg-gray-200 p-2 rounded mb-2 cursor-move"
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
