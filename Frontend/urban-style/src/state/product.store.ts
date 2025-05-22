import type { Products } from "@/interface/product.interface";
import { getAllProducts } from "@/service/product.service";
import { computed, map } from "nanostores";

const productStore = map<Products[]>();

export async function ProductStore() {
  if (!productStore.get().length) {
    const products = await getAllProducts();
    productStore.set(products);
  }

  const productStoreUpdate = async () => {
    const products = await getAllProducts();
    productStore.set(products);
  };

  const getProductById = (productId: string) => {
    const product = computed(productStore, (products) =>
      products.find((product) => product.id === productId)
    );

    return product;
  };

  return { productStore, productStoreUpdate, getProductById };
}
