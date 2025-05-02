import type { Category } from "@/interface/category.interface";
import type {
  FormConfig,
  FormMediator,
} from "@/interface/form-mediator.interface";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/service/categories.service";
import { CategoriesStore } from "@/state/categories.store";

export async function categoriesForm(id?: string): Promise<FormMediator> {
  const sendData = async (formData: FormData) => {
    const categoryData = Object.fromEntries(
      formData.entries()
    ) as unknown as Category;

    if (categoryData.id) {
      await updateCategory(categoryData);
      (await CategoriesStore()).categoriesStoreUpdate();
      return;
    }

    createCategory(categoryData);
    (await CategoriesStore()).categoriesStoreUpdate();
  };

  const sendDelete = (id: string) => {
    deleteCategory(id);
  };

  const formConfig = async (categoryId?: string): Promise<FormConfig> => {
    const category = (await CategoriesStore()).categoriesStore
      .get()
      .filter(({ id }) => id === categoryId)[0];

    const form: FormConfig = {
      title: "Categoría",
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
    sendDelete,
  };
}
