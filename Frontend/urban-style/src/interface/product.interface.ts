import { createProduct } from "@/service/product.service";

export interface Products {
  id: string;
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
