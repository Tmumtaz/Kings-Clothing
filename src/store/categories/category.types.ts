export enum CATEGORIES_ACTION_TYPES {
    FETCH_CATEGORY_START = 'category/FETCH_CATEGORY_START',
    FETCH_CATEGORY_SUCCESS = 'category/FETCH_CATEGORY_SUCCESS',
    FETCH_CATEGORY_FAILED = 'category/FETCH_CATEGORY_FAILED',
};

export type CategoryItem = {
    id: number;
    imageUrl: string;
    name: string;
    price: number;
};

export type Category = {
    title: string;
    imageUrl: string;
    items: CategoryItem[];
};

export type CategoryMap = {
    [key:string]: CategoryItem[];
}