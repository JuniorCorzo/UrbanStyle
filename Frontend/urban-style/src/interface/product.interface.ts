import type { BaseDocument } from "./base.interface";
import type { Category } from "./category.interface";

type AttributesItem = {
  name: string;
  quantity: number;
};

export interface Products extends BaseDocument {
  name: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  categories: Pick<Category, "id" | "name">[];
  attributes: {
    color: AttributesItem[];
    size: AttributesItem[];
  };
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

export interface CreateProduct extends Omit<Products, "id"> {}
