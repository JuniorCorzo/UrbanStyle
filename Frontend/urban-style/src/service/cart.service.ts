import { PUBLIC_API_URL } from "@/config/env-config";
import type { Cart } from "@/interface/cart.interface";
import type { Response } from "@/interface/response.interface";
import axios from "axios";

export function CartService() {
  const getCartByUserId = async (userId: string, token?: string) => {
    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const resultRequest: Cart | void = await axios
      .get(`${PUBLIC_API_URL}/shopping-cart?user-id=${userId}`, {
        withCredentials: true,
        headers,
      })
      .then((response) => {
        return (response.data as Response<Cart>).data[0];
      })
      .catch((error) => {
        console.error("Error fetching cart user by ID:", error);
      });

    return resultRequest;
  };

  const addProductToCart = async (cart: Cart) => {
    const resultRequest: Cart = await axios
      .post(`${PUBLIC_API_URL}/shopping-cart/add-product`, cart, {
        withCredentials: true,
      })
      .then((response) => {
        const data = (response.data as Response<Cart>).data[0];
        return data;
      });

    return resultRequest;
  };

  const updateQuantityProductInCart = async (
    userId: string,
    productId: string,
    quantity: number
  ) => {
    const resultRequest: Cart = await axios
      .patch(
        `${PUBLIC_API_URL}/shopping-cart/change-quantity?user-id=${userId}&product-id=${productId}&quantity=${quantity}`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        const data = (response.data as Response<Cart>).data[0];
        return data;
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

  const removeProductFromCart = async (userId: string, productId: string) => {
    const resultRequest: Cart = await axios
      .delete(
        `${PUBLIC_API_URL}/shopping-cart/delete-product?user-id=${userId}&product-id=${productId}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        const data = (response.data as Response<Cart>).data[0];
        return data;
      });

    return resultRequest;
  };

  return {
    getCartByUserId,
    addProductToCart,
    updateQuantityProductInCart,
    updateProductInCart,
    removeProductFromCart,
  };
}
