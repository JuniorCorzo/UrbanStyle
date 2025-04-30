import type { Category } from "@/interface/category.interface";
import type {
  FormConfig,
  FormMediator,
} from "@/interface/form-mediator.interface";
import { createCategory, updateCategory } from "@/service/categories.service";
import { CategoriesStore } from "@/state/categories.store";

export async function categoriesForm(id?: string): Promise<FormMediator> {
  const sendData = (formData: FormData) => {
    const categoryData = Object.fromEntries(
      formData.entries()
    ) as unknown as Category;

    if (categoryData.id) {
      updateCategory(categoryData);
      return;
    }

    createCategory(categoryData);
  };

  const formConfig = async (categoryId?: string): Promise<FormConfig> => {
    const category = (await CategoriesStore()).categoriesStore
      .get()
      .filter(({ id }) => id === categoryId)[0];

    const form: FormConfig = {
      title: "Categories",
      fields: [
        {
          type: "text",
          fieldProperties: {
            label: "Nombre",
            name: "name",
            placeholder: "Nombre de la categoría",
            required: true,
            value: category?.name ?? "",
          },
        },
        {
          type: "text",
          fieldProperties: {
            label: "Descripción",
            name: "description",
            placeholder: "Descripción de la categoría",
            required: true,
            value: category?.description ?? "",
          },
        },
      ],
    };

    return form;
  };

  return {
    formConfig,
    sendData,
  };
}
