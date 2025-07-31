package io.github.juniorcorzo.UrbanStyle.domain.repository;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.CategoryReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.SalesRecord;

import java.util.List;

public interface ReportRepository {
    List<ProductReportSalesDTO> findProductsMoreSold();
    List<CategoryReportSalesDTO> findCategoriesMoreSold();
    List<ReportSalesDTO> reportSales();
}
