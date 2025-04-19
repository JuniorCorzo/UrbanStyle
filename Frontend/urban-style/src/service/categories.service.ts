import { PUBLIC_API_URL } from "@/config/env-config";
import type { Category, CreateCategory } from "@/interface/category.interface";
import type { Response } from "@/interface/response.interface";
import axios from "axios";

export async function getAllCategories() {
  console.log("PUBLIC_API_URL", PUBLIC_API_URL);
  const response = await axios
    .get(`${import.meta.env.PUBLIC_API_URL}/categories/all`)
    .then((response) => {
      return response.data as Response<Category>;
    });

  return response.data;
}

export async function createCategory(category: CreateCategory) {
  const response = await axios
    .post(`${import.meta.env.PUBLIC_API_URL}/categories/create`, category)
    .then((response) => {
      return response.data as Response<Category>;
    });

  return response.data;
}
export async function updateCategory(category: Category) {
  const response = await axios
    .put(`${import.meta.env.PUBLIC_API_URL}/categories/update`, category)
    .then((response) => {
      return response.data as Response<Category>;
    });

  return response.data;
}
export async function deleteCategory(categoryId: string) {
  const response = await axios
    .delete(`${import.meta.env.PUBLIC_API_URL}/categories/delete/${categoryId}`)
    .then((response) => {
      return response.data as Response<Category>;
    });

  return response.data;
}
