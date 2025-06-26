import type { Category, CategorySummary } from "@/interface/category.interface";
import type { SelectOptions } from "@/interface/form-mediator.interface";
import type {
  Attributes,
  CreateProduct,
  Products,
  UpdateProduct,
} from "@/interface/product.interface";
import { imageToBase64 } from "@/lib/utils/image-to-base64";

export class ProductAdapter {
  private static async formDataToProduct(
    formData: FormData
  ): Promise<Products> {
    const {
      id,
      name,
      description,
      categories,
      price,
      attributes,
      discount,
      images,
    } = Object.fromEntries(formData) as Record<string, any>;

    const getCategories = (): CategorySummary[] =>
      (JSON.parse(categories) as SelectOptions[]).map(({ text, value }) => {
        return { id: value, name: text };
      });

    const getAttributes = (): Attributes[] => JSON.parse(attributes);

    const getImages = () => imageToBase64(images) ?? "";
    return {
      id: id,
      name: name,
      description: description,
      categories: getCategories(),
      images: [await getImages()],
      price: Number.parseInt(price),
      discount: Number.parseInt(discount),
      stock: 0,
      attributes: getAttributes(),
    };
  }

  static async formDataToCreateProduct(
    formData: FormData
  ): Promise<CreateProduct> {
    const { id, stock, ...createProduct } = await this.formDataToProduct(
      formData
    );

    return {
      ...createProduct,
    };
  }

  static async formDataToUpdateProduct(
    formData: FormData,
    id: string
  ): Promise<UpdateProduct> {
    const { stock, ...updateProduct } = await this.formDataToProduct(formData);

    return {
      ...updateProduct,
      id,
    };
  }
}
