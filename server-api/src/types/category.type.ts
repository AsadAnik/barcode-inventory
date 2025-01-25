/**
 * Category model interface
 */
interface ICategory {
    id?: string;
    _id?: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Category Create and Update interface
 */
interface ICategoryCreate {
    name: string;
}

/**
 * Category Update interface
 */
interface ICategoryUpdate {
    id: string;
    name?: string;
}

export { ICategory, ICategoryCreate, ICategoryUpdate };