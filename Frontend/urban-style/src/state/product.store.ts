import type { Products } from "@/interface/product.interface";
import { getAllProducts } from "@/service/product.service";
import { map } from "nanostores";

export async function ProductStore() {
  const productStore = map<Products[]>();
  if (productStore.get().length === 0) {
    const products = await getAllProducts();
    productStore.set(products);
  }

  const productStoreUpdate = async () => {
    const products = await getAllProducts();
    productStore.set(products);
  };

  return { productStore, productStoreUpdate };
}
