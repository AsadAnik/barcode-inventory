import { Category } from '../models';
import { ICategoryCreate, ICategoryUpdate } from '../types';
import ProductService from './product.service';

class CategoryService {
    private readonly categoryModelRepository: typeof Category;
    private readonly productService: ProductService;

    constructor(categoryModelRepository: typeof Category = Category, productService: ProductService = new ProductService()) {
        this.categoryModelRepository = categoryModelRepository;
        this.productService = productService;
    }

    /**
     * CREATE CATEGORY
     * Creates a new category.
     * @param categoryData 
     * @param userId
     * @returns 
     */
    // region Create Category
    public async createCategory(categoryData: ICategoryCreate, userId: string) {
        try {
            const category = await this.categoryModelRepository.create({ ...categoryData, user: userId });
            return category;

        } catch (error) {
            console.error(`Error occcured while register user: ${error}`);
            throw error
        }
    }

    /**
     * GET FULL KANBAN LIST
     * Categoies with Products
     * Aggregated products with each categories
     * @param userId 
     * @returns 
     */
    public async getProductsKanban(userId: string): Promise<any> {
        try {
            const kanbanList = await this.categoryModelRepository.aggregate([
                {
                    $match: { user: userId },
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: 'category',
                        as: 'products',
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        products: {
                            $map: {
                                input: '$products',
                                as: 'product',
                                in: {
                                    _id: '$$product._id',
                                    name: '$$product.name',
                                    status: '$$product.status',
                                },
                            },
                        },
                    },
                },
            ]);


            // Structure the response into an object with categories as keys and product arrays as values
            const transformedKanbanList = kanbanList.reduce((acc: any, category: any) => {
                acc[category.name] = category.products; // Maps category name to the products array
                return acc;
            }, {});

            // console.log(kanbanList);
            return transformedKanbanList;

        } catch (error) {
            console.error(`Error occcured while register user: ${error}`);
            throw error
        }
    }


    /**
     * UPDATE CATEGORY
     * Updates an existing category.
     * @param categoryId
     * @param categoryData 
     * @returns 
     */
    // region Update Category
    public async updateCategory(categoryId: string, categoryData: ICategoryUpdate) {
        try {
            const category = await this.categoryModelRepository.findByIdAndUpdate(categoryId, categoryData, { new: true });
            return category;

        } catch (error) {
            console.error(`Error occcured while register user: ${error}`);
            throw error
        }
    }


    /**
     * DELETE CATEGORY
     * Deletes an existing category.
     * @param categoryId 
     */
    // region Delete Category
    public async deleteCategory(categoryId: string): Promise<void> {
        try {
            // delete all categories from all products
            await this.productService.deleteProductByCategory(categoryId);
            // delete category
            await this.categoryModelRepository.findByIdAndDelete(categoryId);

        } catch (error) {
            console.error(`Error occcured while register user: ${error}`);
            throw error
        }
    }
}

export default CategoryService;