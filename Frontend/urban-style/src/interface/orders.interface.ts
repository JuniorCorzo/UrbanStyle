import type { ProductSummary } from "./product.interface";

export type OrderStatus = "PROCESSING" | "SENT" | "DELIVERED" | "CANCELED";
export type PaymentMethod = "CARD" | "EFFECTIVE" | "PSE";
export interface OrderEvent {
  status: OrderStatus;
  date: string;
  description: string;
}

export interface OrderHistory {
  events: OrderEvent[];
}

export interface Order {
  userId: string;
  products: ProductSummary[];
  total: number;
  status: OrderStatus;
  address: Address;
  paymentMethod: PaymentMethod;
  orderDate: string;
  history: OrderHistory;
}
