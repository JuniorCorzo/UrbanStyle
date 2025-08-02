package io.github.juniorcorzo.UrbanStyle.domain.repository;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.CategoryReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.OrderReportDTO;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ReportSalesDTO;

import java.util.List;

public interface ReportRepository {
    List<ProductReportSalesDTO> productReport();
    List<CategoryReportSalesDTO> categoryReport();
    List<OrderReportDTO> orderReport();
    List<ReportSalesDTO> reportSales();
}
