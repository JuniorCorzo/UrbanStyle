import { PUBLIC_API_URL } from '@/config/env-config'
import type {
	CategoryReport,
	OrderReport,
	ProductReport,
	ReportSales,
} from '@/interface/report.interface'
import type { Response } from '@/interface/response.interface'
import axios from 'axios'

export function ReportService() {
	const productsReport = async () => {
		const resultRequest: ProductReport[] = await axios
			.get(`${PUBLIC_API_URL}/reports/product-report`, {
				withCredentials: true,
			})
			.then((response) => {
				return (response.data as Response<ProductReport>).data
			})

		return resultRequest
	}

	const categoryReport = async () => {
		const resultRequest: CategoryReport[] = await axios
			.get(`${PUBLIC_API_URL}/reports/category-report`, {
				withCredentials: true,
			})
			.then((response) => {
				if (response.status !== 200) throw Error(response.data)
				console.log(response.headers)
				return (response.data as Response<CategoryReport>).data
			})
			.catch((err) => {
				console.error(err)
				throw Error(err)
			})

		return resultRequest
	}

	const orderReport = async () => {
		const resultRequest: OrderReport = await axios
			.get(`${PUBLIC_API_URL}/reports/order-report`, {
				withCredentials: true,
			})
			.then((response) => {
				if (response.status !== 200) throw Error(response.data)

				return (response.data as Response<OrderReport>).data[0]
			})
			.catch((err) => {
				console.error(err)
				throw Error(err)
			})

		return resultRequest
	}

	const reportSales = async (token?: string) => {
		const resultRequest: ReportSales = await axios
			.get(`${PUBLIC_API_URL}/reports/report-sales`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				withCredentials: true,
			})
			.then((response) => {
				return (response.data as Response<ReportSales>).data[0]
			})

		return resultRequest
	}

	return {
		productsReport,
		categoryReport,
		orderReport,
		reportSales,
	}
}
