import z from "zod";

const CategoriesSummaryScheme = z.object({
  categoryId: z.string(),
  name: z.string(),
});

export const AttributesScheme = z.object({
  color: z.string().min(1, "El color es obligatorio"),
  size: z.string().min(1, "La talla es obligatoria"),
  quantity: z.number().min(1, "La cantidad es obligatoria"),
});

const ImageScheme = z
  .array(
    z.object({
      color: z.string().min(1, "Cada color debe tener una imagen asociada"),
      image: z.string().min(1, "Debes subir al menos una imagen del producto"),
    })
  )
  .min(1, { message: "Debes subir al menos una imagen del producto" });

export const CreateProductScheme = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  price: z
    .number({ invalid_type_error: "Precio debe ser numérico" })
    .min(1000, "El precio debe ser mayor 1,000"),
  discount: z.number().optional(),
  images: ImageScheme,
  categories: z
    .array(CategoriesSummaryScheme)
    .min(1, "Se requiere al menos una categoría"),
  attributes: z
    .array(AttributesScheme)
    .min(1, "Se requiere al menos un atributo"),
});

export const AddImageScheme = z.object({
  productId: z.string(),
  images: ImageScheme,
});

export const UpdateProductScheme = CreateProductScheme.omit({
  images: true,
});
