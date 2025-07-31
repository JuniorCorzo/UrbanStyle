package io.github.juniorcorzo.UrbanStyle.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.application.service.ReportService;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.CategoryReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.OrderReportDTO;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @GetMapping("/product-report")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDTO<ProductReportSalesDTO> productMostSold() {
        return this.reportService.productReport();
    }

    @GetMapping("/category-report")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDTO<CategoryReportSalesDTO> categoryMostSold() {
        return this.reportService.categoryReport();
    }

    @GetMapping("/order-report")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDTO<OrderReportDTO> orderReport() {
        return this.reportService.orderReport();
    }

    @GetMapping("/report-sales")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDTO<ReportSalesDTO> reportSales() {
        return this.reportService.reportSales();
    }
}
