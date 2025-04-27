import type { BaseDocument } from "./base.interface";

export interface Products extends BaseDocument {
  name: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  categories: string[];
  attributes: {
    color: string;
    size: string;
  };
  stock: number;
}

export interface CreateProduct extends Omit<Products, "id"> {}
