package io.github.juniorcorzo.UrbanStyle.order.application.service;

import io.github.juniorcorzo.UrbanStyle.order.domain.dto.CategoryReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.order.domain.dto.OrderReportDTO;
import io.github.juniorcorzo.UrbanStyle.order.domain.dto.ProductReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.order.domain.dto.ReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.order.domain.repository.ReportRepository;
import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.dtos.response.ResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportRepository reportRepository;

    public ResponseDTO<ProductReportSalesDTO> productReport() {
        return new ResponseDTO<>(HttpStatus.OK, this.reportRepository.productReport(), "Products more sold found successfully");
    }

    public ResponseDTO<CategoryReportSalesDTO> categoryReport() {
        return new ResponseDTO<>(HttpStatus.OK, reportRepository.categoryReport(), "Categories more sold found successfully");
    }

    public ResponseDTO<OrderReportDTO> orderReport() {
        return new ResponseDTO<>(HttpStatus.OK, this.reportRepository.orderReport(), "Order report found successfully");
    }

    public ResponseDTO<ReportSalesDTO> reportSales() {
        return new ResponseDTO<>(HttpStatus.OK, this.reportRepository.reportSales(), "Report sales found successfully");
    }
}
