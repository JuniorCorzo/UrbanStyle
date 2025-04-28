import type { Category } from "@/interface/category.interface";
import { getAllCategories } from "@/service/categories.service";
import { map } from "nanostores";

export async function categoriesStore() {
  const categoriesStore = map<Category[]>();

  if (categoriesStore.get().length === 0) {
    const categories = await getAllCategories();
    categoriesStore.set(categories);
  }

  const categoriesStoreUpdate = async () => {
    const categories = await getAllCategories();
    categoriesStore.set(categories);
  };

  return { categoriesStore, categoriesStoreUpdate };
}
