import axios from "axios";
import type { CreateProduct, Products } from "@/interface/product.interface";
import type { Response } from "@/interface/response.interface";

export const gatAllProducts = async () => {
  const response = await axios
    .get("http://localhost:8080/products/all")
    .then((response) => {
      return response.data as Response<Products>;
    });

  return response.data;
};

export const getProductById = async (productId: string) => {
  const response = await axios
    .get(`http://localhost:8080/products?id=${productId}`)
    .then((response) => {
      return response.data as Response<Products>;
    });

  return response.data[0];
};

export const getProductByCategory = async (categoryName: string) => {
  const response = await axios
    .get(`http://localhost:8080/products/category/${categoryName}`)
    .then((response) => {
      return response.data as Response<Products>;
    });
  return response.data;
};

export const createProduct = async (product: CreateProduct) => {
  const response = await axios
    .post("http://localhost:8080/product/create")
    .then((response) => {
      return response.data as Response<Products>;
    });

  return response.data[0];
};

export const updateProduct = async (product: Products) => {
  const response = await axios
    .put("http://localhost:8080/product/update")
    .then((response) => {
      return response.data as Response<Products>;
    });

  return response.data[0];
};

export const deleteProduct = async (productId: string) => {
  const response = await axios
    .delete(`http://localhost:8080/product/delete/${productId}`)
    .then((response) => {
      return response.data as Response<Products>;
    });
  return response.data[0];
};
