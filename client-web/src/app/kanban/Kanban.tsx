"use client";

import React, { useState } from "react";
import { useFetchKanban } from '@/hooks';
import { useAddCategory, useUpdateProductCategory } from '@/hooks';

export default function KanbanBoard(): React.ReactNode {
    const [newCategory, setNewCategory] = useState("");
    // Fetch categories and products using the custom hook
    const [columns, loading, error, fetchProducts] = useFetchKanban();
    const [categoryLoading, setCategoryLoading] = useState<boolean>(false);
    // Integrate useAddCategory hook
    const { addCategory, loading: addCategoryLoading, error: addCategoryError } = useAddCategory();
    const { updateCategory, loading: updateCategoryLoading, error: updteCategoryError } = useUpdateProductCategory();

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
    const handleDragStart = (event: React.DragEvent, item: string, from: string) => {
        event.dataTransfer.setData("text/plain", JSON.stringify({ item, from }));
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };

    // region Handle Drop
    const handleDrop = async (event: React.DragEvent, toCategoryId: string) => {
        event.preventDefault();

        const transferData = event.dataTransfer.getData("text/plain");
        // We can getting the productId and categoryId from the transferData
        // But as for categoryId, we will be getting by property..
        const { item: productId, from: fromCategoryId } = JSON.parse(transferData);

        console.log('productId and categoryId - ', productId, toCategoryId);

        try {
            console.log('productId and categoryId', productId, toCategoryId);
            // Update the product category with categoryId instead of categoryName
            await updateCategory(productId, toCategoryId);

            // Re-fetch categories/products to reflect changes
            fetchProducts();
        } catch (error) {
            console.error("Error updating product category:", error);
        }
    };

    // region UI
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

            {(loading || categoryLoading || addCategoryLoading) ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Object.entries(columns).map(([_categoryName, categoryData]: [string, any]) => {
                        return (
                            <div
                                key={categoryData._id}
                                onDragOver={handleDragOver}
                                onDrop={(event) => handleDrop(event, categoryData._id)}
                                className="bg-white rounded shadow p-4 min-h-[200px]"
                            >
                                <h2 className="text-xl font-semibold mb-4">{categoryData.name}</h2>
                                {(categoryData.products || []).map((product: any) => (
                                    <div
                                        key={product._id}
                                        draggable
                                        onDragStart={(event) =>
                                            handleDragStart(event, product._id, categoryData._id)
                                        }
                                        className="bg-gray-200 p-2 rounded mb-2 cursor-move"
                                    >
                                        {product.name}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
