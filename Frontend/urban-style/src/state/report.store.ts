import type { BestSeller, ReportSales } from "@/interface/report.interface";
import { ReportService } from "@/service/report.service";
import { map } from "nanostores";

const productMoreSoldStore = map<BestSeller[]>();
const categoriesMoreSoldStore = map<BestSeller[]>();
export const reportSalesStore = map<ReportSales>();

export function ReportStore() {
  const getProductsMoreSold = async () => {
    if (!productMoreSoldStore.get().length) {
      const report = await ReportService().productsMoreSold();
      productMoreSoldStore.set(report);
    }

    return productMoreSoldStore.get();
  };

  const getCategoriesMoreSold = async () => {
    if (!categoriesMoreSoldStore.get().length) {
      const report = await ReportService().categoriesMoreSold();
      categoriesMoreSoldStore.set(report);
    }

    return categoriesMoreSoldStore.get();
  };

  const getReportSales = async () => {
    if (reportSalesStore.get()?.day == undefined) {
      const report = await ReportService().reportSales();
      reportSalesStore.set(report);
    }

    return reportSalesStore.get();
  };

  return {
    getProductsMoreSold,
    getCategoriesMoreSold,
    getReportSales,
  };
}
