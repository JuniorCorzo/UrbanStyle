import type { FormMediator } from "@/interface/form-mediator.interface";
import { productStore, ProductStore } from "@/state/product.store";
import {
  addImageToProduct,
  createProduct,
  deleteImageToProduct,
  deleteProduct,
  updateProduct,
} from "@/service/product.service";
import { ProductAdapter } from "@/adapter/product.adapters";
import { imagesStore } from "@/state/attributes.state";
import type {
  AddImageProduct,
  Products,
  UpdateProduct,
} from "@/interface/product.interface";
import { imageToBase64 } from "../utils/image-to-base64";

export async function productForm(): Promise<FormMediator> {
  const sendProduct = async (data?: FormData, id?: string) => {
    if (!data) return;

    if (id) {
      const product = await ProductAdapter.formDataToUpdateProduct(data, id);

      await checkImages(product.id);
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

async function checkImages(productId: string) {
  const products = new Map<string, Products>();
  productStore?.get()?.map((product) => products.set(product.id, product));

  const images = imagesStore.get();
  const imagesDelete: AddImageProduct = {
    productId: productId,
    images: images
      .filter(({ isDelete }) => isDelete === true)
      .map(({ file, color }) => ({ image: file.name, color })),
  };

  const imagesAdd: AddImageProduct = {
    productId,
    images: await Promise.all(
      images
        .filter(({ isUpload }) => isUpload === false)
        .map(async ({ file, color }) => {
          return { color, image: await imageToBase64(file) };
        })
    ),
  };

  if (imagesDelete.images.length > 0) deleteImageToProduct(imagesDelete);
  if (imagesAdd.images.length > 0) addImageToProduct(imagesAdd);
}
