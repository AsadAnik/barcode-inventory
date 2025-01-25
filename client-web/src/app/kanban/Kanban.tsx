"use client";

import React, { useState, useEffect } from "react";
import { useFetchKanban } from '@/hooks';
import useAddCategory from '@/hooks/useAddCategory'; // Import the custom hook

export default function KanbanBoard(): React.ReactNode {
    const [newCategory, setNewCategory] = useState("");
    // Fetch categories and products using the custom hook
    const [columns, loading, error, fetchProducts] = useFetchKanban();
    const [categoryLoading, setCategoryLoading] = useState<boolean>(false);
    // Integrate useAddCategory hook
    const { addCategory, loading: addCategoryLoading, error: addCategoryError } = useAddCategory();

    // Add new category
    // region Add Category
    const addNewCategory = async () => {
        const categoryName = newCategory.trim();

        if (categoryName && !columns.hasOwnProperty(categoryName)) {
            try {
                setCategoryLoading(true);
                // Use the addCategory function from the custom hook
                await addCategory(categoryName);
                fetchProducts();  // Refresh the products
                setNewCategory("");

            } catch (error) {
                console.error("Error adding category:", error);
            } finally {
                setCategoryLoading(false);
            }
        }
    };

    // region Handle Drag
    const handleDragStart = (e: React.DragEvent, item: string, from: string) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({ item, from }));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    // region Handle Drop
    const handleDrop = (e: React.DragEvent, to: string) => {
        e.preventDefault();
        const transferData = e.dataTransfer.getData("text/plain");
        const { productId, from } = JSON.parse(transferData);

        const updatedColumns = { ...columns };

        updatedColumns[from] = updatedColumns[from].filter(
            (item: any) => item._id !== productId
        );
        updatedColumns[to] = [...(updatedColumns[to] || []), productId];

        fetchProducts();  // Re-fetch after changes
    };

    // UI
    return (
        <div className="p-6 min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
            <div className="mb-6">
                {/* Add New Category Input */}
                <input
                    type="text"
                    placeholder="Add new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="border p-2 rounded mr-2"
                />
                <button
                    onClick={addNewCategory}
                    disabled={categoryLoading || addCategoryLoading}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    {categoryLoading || addCategoryLoading ? "Loading..." : "Add Category"}
                </button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Object.entries(columns).map(([columnName, items]) => (
                        <div
                            key={columnName}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, columnName)}
                            className="bg-white rounded shadow p-4 min-h-[200px]"
                        >
                            <h2 className="text-xl font-semibold mb-4">{columnName}</h2>
                            {(Array.isArray(items) ? items : []).map((item: any) => (
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
            )}
        </div>
    );
}
