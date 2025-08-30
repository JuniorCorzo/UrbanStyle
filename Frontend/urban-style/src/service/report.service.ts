import { extractResponse, extractSingleResponse } from '@/adapter/responses.adapter'
import { PUBLIC_API_URL } from '@/config/env-config'
import type {
	CategoryReport,
	OrderReport,
	ProductReport,
	ReportSales,
} from '@/interface/report.interface'
import type { ErrorMessage, Response } from '@/interface/response.interface'
import type { Result } from '@/lib/result_pattern'
import axios from 'axios'

const productsReport = async (): Promise<Result<ProductReport[], ErrorMessage>> => {
	const response = await axios.get<Response<ProductReport>>(
		`${PUBLIC_API_URL}/reports/product-report`,
		{
			withCredentials: true,
		},
	)

	return extractResponse(response)
}

const categoryReport = async (): Promise<Result<CategoryReport[], ErrorMessage>> => {
	const response = await axios.get<Response<CategoryReport>>(
		`${PUBLIC_API_URL}/reports/category-report`,
		{
			withCredentials: true,
		},
	)

	return extractResponse(response)
}

const orderReport = async (): Promise<Result<OrderReport, ErrorMessage>> => {
	const response = await axios.get<Response<OrderReport>>(
		`${PUBLIC_API_URL}/reports/order-report`,
		{
			withCredentials: true,
		},
	)

	return extractSingleResponse(response)
}

const reportSales = async (token?: string): Promise<Result<ReportSales, ErrorMessage>> => {
	const response = await axios.get<Response<ReportSales>>(
		`${PUBLIC_API_URL}/reports/report-sales`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		},
	)

	return extractSingleResponse(response)
}

export const ReportService = {
	productsReport,
	categoryReport,
	orderReport,
	reportSales,
}
