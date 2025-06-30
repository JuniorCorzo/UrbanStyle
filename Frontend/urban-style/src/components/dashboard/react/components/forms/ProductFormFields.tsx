import FileInput from "@/components/react/inputs/FileInput";
import SelectInput from "@/components/react/inputs/SelectInput";
import TextInput from "@/components/react/inputs/TextInput";
import type { SelectOptions } from "@/interface/form-mediator.interface";
import type { Products } from "@/interface/product.interface";
import { CategoriesStore } from "@/state/categories.store";
import { useLayoutEffect, useState } from "react";
import { AttributeFields } from "./AttributeFields";
import { TextAreaInput } from "@/components/react/inputs/TextAreaInput";
import type { FormFieldsProps } from "../Sidebar";
import { ImagesFileInput } from "@/components/react/inputs/ImagesFileInput";

export function ProductFormFields({
  getDefaultValues,
}: FormFieldsProps<Products>) {
  const [categories, setCategories] = useState<SelectOptions[]>();
  const defaultValues = getDefaultValues();

  const getCategories = async (): Promise<SelectOptions[]> =>
    (await CategoriesStore()).categoriesStore.get().map((category) => ({
      value: category.id,
      text: category.name,
    }));

  const {
    name,
    description,
    categories: defaultCategory,
    price,
    discount,
    attributes,
    images,
  } = (defaultValues ?? {}) as Products;

  useLayoutEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <>
      <TextInput
        label="Nombre del producto"
        name="name"
        placeholder="Ej: Camiseta básica unisex"
        defaultValue={name ?? ""}
      />
      <TextAreaInput
        label="Descripción"
        name="description"
        placeholder="Describe el producto, materiales, uso…"
        value={description ?? ""}
      />
      <TextInput
        label="Precio"
        name="price"
        placeholder="Ej: 59.900"
        defaultValue={price ?? ""}
      />
      <TextInput
        label="Descuento (%)"
        name="discount"
        placeholder="Ej: 15"
        type="number"
        defaultValue={discount?.toLocaleString() ?? ""}
      />
      <SelectInput
        label="Categoría"
        name="categories"
        placeholder="Selecciona una o más categorías"
        isMultiple={true}
        value={defaultCategory?.map(({ categoryId, name }) => ({
          text: name,
          value: categoryId,
        }))}
        options={categories}
      />
      <AttributeFields
        name="attributes"
        defaultAttributes={attributes?.map((attribute) => ({
          id: crypto.randomUUID(),
          ...attribute,
        }))}
      />
      <ImagesFileInput
        label="Imágenes del producto"
        name="images"
        defaultImages={images}
      />
    </>
  );
}
