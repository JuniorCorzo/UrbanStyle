package io.github.juniorcorzo.UrbanStyle.domain.repository;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.ReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.SalesRecord;

import java.util.List;

public interface ReportRepository {
    List<SalesRecord> findProductsMoreSold();
    List<SalesRecord> findCategoriesMoreSold();
    List<ReportSalesDTO> reportSales();
}
