interface Products {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  categories: string[];
  attributes: {
    color: string;
    size: string;
  };
  stock: number;
}

interface Response {
  status: string;
  data: Products[];
  message: string;
}

export const fetchProducts = async () => {
  const response = await fetch("http://localhost:8080/products/all");
  const data = await response.json();
  return (data as Response).data;
};
