import { PUBLIC_API_URL } from "@/config/env-config";
import type { Cart } from "@/interface/cart.interface";
import type { ProductSummary } from "@/interface/product.interface";
import type { Response } from "@/interface/response.interface";
import axios from "axios";

export function CartService() {
  const getCartByUserId = async (userId: string) => {
    const resultRequest: Cart = await axios
      .get(`${PUBLIC_API_URL}/shopping-cart/${userId}`)
      .then((response) => {
        return (response.data as Response<Cart>).data[0];
      });

    return resultRequest;
  };

  const addProductToCart = async (cart: Cart) => {
    const resultRequest: Cart = await axios
      .post(`${PUBLIC_API_URL}/shopping-cart/add-product`, cart, {
        withCredentials: true,
      })
      .then((response) => {
        return (response.data as Response<Cart>).data[0];
      });

    return resultRequest;
  };

  const updateProductInCart = async (cart: Cart) => {
    const resultRequest: Cart = await axios
      .post(`${PUBLIC_API_URL}/shopping-cart/update-product`, cart, {
        withCredentials: true,
      })
      .then((response) => {
        return (response.data as Response<Cart>).data[0];
      });

    return resultRequest;
  };

  return {
    getCartByUserId,
    addProductToCart,
    updateProductInCart,
  };
}
