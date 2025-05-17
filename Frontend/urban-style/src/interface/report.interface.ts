export interface BestSeller {
  name: string;
  sold: number;
}

export interface SalesData {
  date: string;
  sales: number;
  total: number;
}

export interface ReportSales {
  day: SalesData[];
  month: SalesData[];
}
