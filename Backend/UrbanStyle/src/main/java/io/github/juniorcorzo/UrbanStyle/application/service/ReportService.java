package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.ReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.SalesRecord;
import io.github.juniorcorzo.UrbanStyle.domain.repository.ReportRepository;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportRepository reportRepository;

    public ResponseDTO<SalesRecord> findProductsMoreSold() {
        return new ResponseDTO<>(HttpStatus.OK, this.reportRepository.findProductsMoreSold(), "Products more sold found successfully");
    }

    public ResponseDTO<SalesRecord> findCategoriesMoreSold() {
        return new ResponseDTO<>(HttpStatus.OK, reportRepository.findCategoriesMoreSold(), "Categories more sold found successfully");
    }
    public ResponseDTO<ReportSalesDTO> reportSales() {
        return new ResponseDTO<>(HttpStatus.OK, this.reportRepository.reportSales(), "Report sales found successfully");
    }
}
