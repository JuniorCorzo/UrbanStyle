import type { Products } from "@/interface/product.interface";

export function formDataToProduct(formData: Record<string, any>): Products {
  return {
    id: formData["id"],
    name: formData["name"],
    description: formData["description"],
    categories: formData["categories"],
    images: formData["images"],
    price: Number.parseInt(formData["price"]),
    discount: Number.parseInt(formData["discount"]),
    stock: Number.parseInt(formData["stock"]),
    attributes: {
      color: formData["color"],
      size: formData["size"],
    },
  };
}
