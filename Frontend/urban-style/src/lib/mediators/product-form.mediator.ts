import type {
  FormConfig,
  FormMediator,
  SelectOptions,
} from "@/interface/form-mediator.interface";
import { getAllCategories } from "@/service/categories.service";

export async function productForm(): Promise<FormMediator> {
  const categories: SelectOptions[] = (await getAllCategories()).map(
    (category) => ({
      value: category.id,
      text: category.name,
    })
  );

  const sendProduct = async (data: FormData) => {
    const productData = Object.fromEntries(data.entries());
  };

  const formConfig: FormConfig = {
    title: "Product Form",
    fields: [
      {
        type: "text",
        fieldProperties: {
          label: "Nombre",
          name: "name",
          placeholder: "Nombre del producto",
          required: true,
        },
      },
      {
        type: "text",
        fieldProperties: {
          label: "Descripción",
          name: "description",
          placeholder: "Descripción del producto",
          required: true,
        },
      },
      {
        type: "text",
        fieldProperties: {
          label: "Precio",
          name: "price",
          placeholder: "Precio del producto",
          required: true,
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
        },
      },
      {
        type: "text",
        fieldProperties: {
          label: "Stock",
          name: "stock",
          placeholder: "Stock del producto",
          required: true,
        },
      },
      {
        type: "select",
        fieldProperties: {
          label: "Talla",
          name: "size",
          placeholder: "Talla del producto",
          required: true,
        },
      },
      {
        type: "text",
        fieldProperties: {
          label: "Color",
          name: "color",
          placeholder: "Color del producto",
          required: true,
        },
      },
      {
        type: "file",
        fieldProperties: {
          label: "Imagen",
          name: "image",
          required: true,
        },
      },
    ],
  };

  return {
    formConfig,
  };
}
