import type {
  FormConfig,
  FormMediator,
  SelectOptions,
} from "@/interface/form-mediator.interface";
import { safeGet } from "../save_get";
import { ProductStore } from "@/state/product.store";
import type { CreateProduct, Products } from "@/interface/product.interface";
import { CategoriesStore } from "@/state/categories.store";
import { imageToBase64 } from "../utils/image-to-base64";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/service/product.service";
import { formDataToProduct } from "@/adapter/product.adapters";

export async function productForm(): Promise<FormMediator> {
  const categories: SelectOptions[] = (await CategoriesStore()).categoriesStore
    .get()
    .map((category) => ({
      value: category.id,
      text: category.name,
    }));

  const sendProduct = async (data: FormData) => {
    const productData = Object.fromEntries(data) as Record<string, any>;
    productData["categories"] = data
      .getAll("categories")
      .map((value) => value.toString());

    productData["images"] = await Promise.all(
      data.getAll("images").map(async (image) => {
        return await imageToBase64(image as File);
      })
    );

    if (productData.id) {
      updateProduct(formDataToProduct(productData));
      (await ProductStore()).productStoreUpdate();
      return;
    }

    createProduct(formDataToProduct(productData) as CreateProduct);
    (await ProductStore()).productStoreUpdate();
  };

  const sendDelete = (id: string) => {
    deleteProduct(id);
  };

  const formConfig = async (productId?: string): Promise<FormConfig> => {
    const productData = (await ProductStore()).productStore
      .get()
      .filter(({ id }) => id === productId)[0];

    const form: FormConfig = {
      title: "Producto",
      fields: [
        {
          type: "text",
          fieldProperties: {
            label: "Nombre",
            name: "name",
            placeholder: "Nombre del producto",
            required: true,
            value: productData?.name ?? "",
          },
        },
        {
          type: "text",
          fieldProperties: {
            label: "Descripción",
            name: "description",
            placeholder: "Descripción del producto",
            required: true,
            value: productData?.description ?? "",
          },
        },
        {
          type: "text",
          fieldProperties: {
            label: "Precio",
            name: "price",
            placeholder: "Precio del producto",
            required: true,
            value: safeGet<Products>(productData, "price") as string,
          },
        },
        {
          type: "text",
          fieldProperties: {
            label: "Descuento",
            name: "discount",
            placeholder: "Descuente del producto",
            value: safeGet<Products>(productData, "discount") as string,
          },
        },
        {
          type: "select",
          fieldProperties: {
            label: "Categoría",
            name: "categories",
            placeholder: "Categorías del producto",
            isMultiple: true,
            required: true,
            options: categories,
            value: productData?.categories ?? "",
          },
        },
        {
          type: "text",
          fieldProperties: {
            label: "Stock",
            name: "stock",
            placeholder: "Stock del producto",
            required: true,
            value: productData?.stock.toString() ?? "",
          },
        },
        {
          type: "select",
          fieldProperties: {
            label: "Talla",
            name: "size",
            placeholder: "Talla del producto",
            required: true,
            value: productData?.attributes.size ?? "",
          },
        },
        {
          type: "text",
          fieldProperties: {
            label: "Color",
            name: "color",
            placeholder: "Color del producto",
            required: true,
            value: productData?.attributes?.color ?? "",
          },
        },
        {
          type: "file",
          fieldProperties: {
            label: "Imagen",
            name: "images",
            required: true,
          },
        },
      ],
    };

    return form;
  };

  return {
    formConfig,
    sendData: sendProduct,
    sendDelete,
  };
}
