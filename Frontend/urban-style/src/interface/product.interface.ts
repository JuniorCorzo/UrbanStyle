import type { BaseDocument } from "./base.interface";
import type { CategorySummary } from "./category.interface";

export type Attributes = {
  color: string;
  size: string;
  quantity: number;
};

export interface Products extends BaseDocument {
  name: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  categories: CategorySummary[];
  attributes: Attributes[];
  stock: number;
}

export interface ProductsGroupedCategory {
  category: string;
  products: Products[];
}

export interface ProductSummary
  extends Pick<Products, "name" | "price" | "discount"> {
  productId: Products["id"];
  color: string;
  size: string;
  quantity: number;
}

export interface CreateProduct extends Omit<Products, "id" | "stock"> {}
export interface UpdateProduct extends Omit<Products, "stock"> {}
