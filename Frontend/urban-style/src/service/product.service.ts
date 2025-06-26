import axios from "axios";
import type {
  CreateProduct,
  Products,
  ProductsGroupedCategory,
  UpdateProduct,
} from "@/interface/product.interface";
import type { Response } from "@/interface/response.interface";
import { PUBLIC_API_URL } from "@/config/env-config";

export const getAllProducts = async () => {
  const response = await axios
    .get(`${PUBLIC_API_URL}/products/all`)
    .then((response) => {
      return response.data as Response<Products>;
    });

  return response.data;
};

export async function getProductsGroupedByCategory(): Promise<
  ProductsGroupedCategory[]
> {
  const response = await axios
    .get<Response<ProductsGroupedCategory>>(`${PUBLIC_API_URL}/products/group`)
    .then((response) => {
      if (response.status !== 200) throw Error(response.statusText);
      return response.data;
    });

  return response.data;
}

export const getProductById = async (productId: string) => {
  const response = await axios
    .get(`${PUBLIC_API_URL}/products?id=${productId}`)
    .then((response) => {
      return response.data as Response<Products>;
    });

  return response.data[0];
};

export const getProductByCategory = async (categoryName: string) => {
  const response = await axios
    .get(`${PUBLIC_API_URL}/products/${categoryName}`)
    .then((response) => {
      return response.data as Response<Products>;
    });
  return response.data;
};

export const searchProducts = async (searchQuery: string) => {
  const response = await axios
    .get(`${PUBLIC_API_URL}/products/search?search=${searchQuery}`)
    .then((response) => {
      return response.data as Response<Products>;
    });

  return response.data;
};

export const createProduct = async (product: CreateProduct) => {
  const response = await axios
    .post(`${PUBLIC_API_URL}/products/create`, product, {
      withCredentials: true,
    })
    .then((response) => {
      return response.data as Response<Products>;
    });

  return response.data[0];
};

export const updateProduct = async (product: UpdateProduct) => {
  const response = await axios
    .put(`${PUBLIC_API_URL}/products/update`, product, {
      withCredentials: true,
    })
    .then((response) => {
      return response.data as Response<Products>;
    });

  return response.data[0];
};

export const deleteProduct = async (productId: string) => {
  const response = await axios
    .delete(`${PUBLIC_API_URL}/products/delete/${productId}`, {
      withCredentials: true,
    })
    .then((response) => {
      return response.data as Response<Products>;
    });
  return response.data[0];
};
