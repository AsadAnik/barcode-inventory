"use client";

import React, { useState, useEffect } from "react";
import { useFetchKanban } from '@/hooks';
import { useAddCategory, useUpdateProductCategory, useRemoveCategory } from '@/hooks';
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';

export default function KanbanBoard(): React.ReactNode {
    const router = useRouter();
    const [newCategory, setNewCategory] = useState("");
    // Fetch categories and products using the custom hook
    const [columns, loading, error, fetchProducts] = useFetchKanban();
    const [categoryLoading, setCategoryLoading] = useState<boolean>(false);
    // Integrate useAddCategory hook
    const { addCategory, loading: addCategoryLoading, error: addCategoryError } = useAddCategory();
    const { updateCategory, loading: updateCategoryLoading, error: updateCategoryError } = useUpdateProductCategory();
    const { removeCategory, loading: removeCategoryLoading, error: removeCategoryError } = useRemoveCategory();

    // Component's error handler
    useEffect(() => {
        if (addCategoryError || updateCategoryError || removeCategoryError) {
            toast.error("Something is not well on Kanban's Health");
        }

    }, [addCategoryError, updateCategoryError, removeCategoryError]);


    // Add new category
    // region Add Category
    const addNewCategory = async (): Promise<void> => {
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
                toast.error("Error adding category");

            } finally {
                setCategoryLoading(false);
            }
        }
    };

    /**
     * REMOVE CATEGORY
     * Removes the category of a product.
     * @param categoryId 
     */
    // region Remove Category
    const removeCategoryHandle = async (categoryId: string): Promise<void> => {
        try {
            const confirmation = window.confirm("Are you sure you want to remove this category?");

            if (confirmation) {
                await removeCategory(categoryId);
                fetchProducts();  // Refresh the products
            }

        } catch (error) {
            console.error("Error removing category:", error);
            toast.error("Error removing category");
        }
    }

    // region Handle Drag
    const handleDragStart = (event: React.DragEvent, item: string, from: string) => {
        event.dataTransfer.setData("text/plain", JSON.stringify({ item, from }));
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };

    /**
     * HANDLE DROP
     * This will handle the drop event
     * And then update the product category with categoryId
     * Send the API to update products category
     * @param event 
     * @param toCategoryId 
     */
    // region Handle Drop
    const handleDrop = async (event: React.DragEvent, toCategoryId: string) => {
        event.preventDefault();

        const transferData = event.dataTransfer.getData("text/plain");
        // We can getting the productId and categoryId from the transferData
        // But as for categoryId, we will be getting by property..
        const { item: productId, from: fromCategoryId } = JSON.parse(transferData);
        // console.log('productId and categoryId - ', productId, toCategoryId);

        try {
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
            <div className="flex space-x-4 justify-between">
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

                <div>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => router.push("/scanner")}
                    >
                        Scan for new Product
                    </button>
                </div>
            </div>

            {(loading || categoryLoading || addCategoryLoading || updateCategoryLoading || removeCategoryLoading) ? (
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
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold mb-4">{categoryData.name}</h2>
                                    <button
                                        onClick={() => removeCategoryHandle(categoryData._id)}
                                        className="ml-2 p-1 bg-orange-300 text-white rounded text-xs hover:bg-red-500"
                                    >
                                        Remove
                                    </button>
                                </div>

                                {(categoryData.products || []).map((product: any) => (
                                    <div
                                        key={product._id}
                                        draggable
                                        onDragStart={(event) =>
                                            handleDragStart(event, product._id, categoryData._id)
                                        }
                                        className="bg-gray-200 p-2 rounded mb-2 cursor-move"
                                    >
                                        <h3>{product.name} - (<span className="text-sm">{product.barcode}</span>)</h3>
                                        <p className="text-xs">{product.description}</p>
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
