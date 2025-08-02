import type { IDashboardStrategy } from "@/interface/dashboard-strategy.interface";
import { orderTable } from "../mediators/order-table.mediator";

export class OrderStrategy  implements IDashboardStrategy {
  execute() {
    orderTable()
  }
}