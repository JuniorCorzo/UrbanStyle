import type { BaseDocument } from "./base.interface";

export interface Category extends BaseDocument {
  name: string;
  description: string;
}

export interface CreateCategory extends Omit<Category, "id"> {}
export type CategorySummary = {
  categoryId: string;
  name: string;
};
