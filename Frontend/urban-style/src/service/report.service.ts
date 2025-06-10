import { PUBLIC_API_URL } from "@/config/env-config";
import type { BestSeller, ReportSales } from "@/interface/report.interface";
import type { Response } from "@/interface/response.interface";
import axios from "axios";

export function ReportService() {
  const productsMoreSold = async () => {
    const resultRequest: BestSeller[] = await axios
      .get(`${PUBLIC_API_URL}/orders/products-most-sold`, {
        withCredentials: true,
      })
      .then((response) => {
        return (response.data as Response<BestSeller>).data;
      });

    return resultRequest;
  };

  const categoriesMoreSold = async () => {
    const resultRequest: BestSeller[] = await axios
      .get(`${PUBLIC_API_URL}/orders/categories-most-sold`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status !== 200) throw Error(response.data);
        console.log(response.headers);
        return (response.data as Response<BestSeller>).data;
      })
      .catch((err) => {
        console.error(err);
        throw Error(err);
      });

    return resultRequest;
  };

  const reportSales = async (token: string) => {
    const resultRequest: ReportSales = await axios
      .get(`${PUBLIC_API_URL}/orders/report-sales`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return (response.data as Response<ReportSales>).data[0];
      });

    return resultRequest;
  };

  return {
    productsMoreSold,
    categoriesMoreSold,
    reportSales,
  };
}
