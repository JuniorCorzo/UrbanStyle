import type {
  FormMediator,
  SelectOptions,
} from "@/interface/form-mediator.interface";
import { ProductStore } from "@/state/product.store";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/service/product.service";
import { ProductAdapter } from "@/adapter/product.adapters";

export async function productForm(): Promise<FormMediator> {
  const sendProduct = async (data?: FormData, id?: string) => {
    if (!data) return;

    if (id) {
      const product = await ProductAdapter.formDataToUpdateProduct(data, id);

      await updateProduct(product);
      (await ProductStore()).productStoreUpdate();
      return;
    }

    const product = await ProductAdapter.formDataToCreateProduct(data);

    createProduct(product);
    (await ProductStore()).productStoreUpdate();
  };

  const sendDelete = (id: string) => {
    deleteProduct(id);
  };

  return {
    title: "Nuevo producto",
    formType: "product",
    sendData: sendProduct,
    sendDelete,
  };
}
