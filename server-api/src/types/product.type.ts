/**
 * PRODUCT TYPE
 * This is product types
 */
interface IProduct {
    id: number;
    name: string;
    barcode: string;
    price?: number;
    description?: string;
    image?: string;
    user?: string;
    category?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * PRODUCT CREATE
 * The Product Create Type
 */
interface IProductCreate {
    name: string;
    barcode: string;
    price?: number;
    description?: string;
    image?: string;
}

/**
 * PRODUCT UPDATE
 * The Product Update Type
 */
interface IProductUpdate {
    name?: string;
    barcode?: string;
    price?: number;
    description?: string;
    image?: string;
}

export { IProduct, IProductCreate, IProductUpdate };