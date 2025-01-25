"use client";

import React, { useState } from "react";
import { useFetchProducts, useAddCategory } from '@/hooks';

const initialColumns = {
  Uncategorized: [],
  "In Progress": [],
  Completed: [],
};

export default function KanbanBoard(): React.ReactNode {
  const [columns, setColumns] = useState<typeof initialColumns>(initialColumns);
  const [newItem, setNewItem] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [data, loading, error, fetchProducts] = useFetchProducts();
  const { addCategory, loading: categoryLoading, error: categoryError } = useAddCategory();

  console.log('DATA HERE - ', data);

  // region Add New Category
  const addNewCategory = async() => {
    const categoryName = newCategory.trim();

    if (categoryName && !data.hasOwnProperty(categoryName)) {
      try {
        await addCategory(categoryName);
        setColumns((prev) => ({ ...prev, [categoryName]: [] }));
        fetchProducts(); // refresh the products
        setNewCategory("");

      } catch (error) {
        console.error("Error adding category:", error);
      }
    } 
  }

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
    const transferData = e.dataTransfer.getData("text/plain");
    const { productId, from } = JSON.parse(transferData);

    const updatedColumns = { ...data };

    // Move the item between columns
    updatedColumns[from] = updatedColumns[from].filter(
      (item: any) => item._id !== productId
    );

    updatedColumns[to] = [...(updatedColumns[to] || []), productId];

    // Update the state
    // Calling the fetch product function again for fetching the updated data
    fetchProducts();
  };

  // region Add New Item
  // const addNewItem = () => {
  //   if (newItem.trim()) {
  //     setColumns((prev: any) => ({
  //       ...prev,
  //       Uncategorized: [...prev.Uncategorized, newItem] as string[],
  //     }));

  //     setNewItem("");
  //   }
  // };

  // region UI
  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
      <div className="mb-6">
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

      {/* Kanban board */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(data).map(([columnName, items]) => (
          <div
            key={columnName}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, columnName)}
            className="bg-white rounded shadow p-4 min-h-[200px]"
          >
            <h2 className="text-xl font-semibold mb-4">{columnName}</h2>
            {console.log('Item here -- for the Data - ', items)}
            {(items as any).map((item: any) => (
              <div
                key={item._id}
                draggable
                onDragStart={(e) => handleDragStart(e, item._id, columnName)}
                className="bg-gray-200 p-2 rounded mb-2 cursor-move"
              >
                {item.name}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
