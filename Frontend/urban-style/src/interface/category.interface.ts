export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface CreateCategory extends Omit<Category, "id"> {}
