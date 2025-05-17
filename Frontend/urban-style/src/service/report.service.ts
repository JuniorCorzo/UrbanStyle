import { PUBLIC_API_URL } from "@/config/env-config";
import type { BestSeller, ReportSales } from "@/interface/report.interface";
import type { Response } from "@/interface/response.interface";
import axios from "axios";

export function ReportService() {
  const productsMoreSold = async () => {
    const resultRequest: BestSeller[] = await axios
      .get(`${PUBLIC_API_URL}/orders/products-most-sold`)
      .then((response) => {
        return (response.data as Response<BestSeller>).data;
      });

    return resultRequest;
  };

  const categoriesMoreSold = async () => {
    const resultRequest: BestSeller[] = await axios
      .get(`${PUBLIC_API_URL}/orders/categories-most-sold`)
      .then((response) => {
        return (response.data as Response<BestSeller>).data;
      });

    return resultRequest;
  };

  const reportSales = async () => {
    const resultRequest: ReportSales[] = await axios
      .get(`${PUBLIC_API_URL}/orders/report-sales`)
      .then((response) => {
        return (response.data as Response<ReportSales>).data;
      });

    return resultRequest;
  };

  return {
    productsMoreSold,
    categoriesMoreSold,
    reportSales,
  };
}
