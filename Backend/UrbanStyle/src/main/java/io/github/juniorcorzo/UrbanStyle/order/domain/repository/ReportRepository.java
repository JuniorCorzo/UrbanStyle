package io.github.juniorcorzo.UrbanStyle.order.domain.repository;

import io.github.juniorcorzo.UrbanStyle.order.domain.dto.CategoryReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.order.domain.dto.OrderReportDTO;
import io.github.juniorcorzo.UrbanStyle.order.domain.dto.ProductReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.order.domain.dto.ReportSalesDTO;

import java.util.List;

public interface ReportRepository {
    List<ProductReportSalesDTO> productReport();
    List<CategoryReportSalesDTO> categoryReport();
    List<OrderReportDTO> orderReport();
    List<ReportSalesDTO> reportSales();
}
