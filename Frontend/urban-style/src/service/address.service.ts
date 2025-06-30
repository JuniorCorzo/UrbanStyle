import { DepartmentAdapter, MunicipalityAdapter } from '@/adapter/location.adapter'
import { PUBLIC_API_URL } from '@/config/env-config'
import type {
	Address,
	CreateAddress,
	DepartmentDTOResponse,
	MunicipalityDTOResponse,
	UpdateAddress,
} from '@/interface/address.interface'
import type { Response } from '@/interface/response.interface'
import axios from 'axios'

export class AddressService {
	static async getAddressByUserId(userId: string): Promise<Address[]> {
		const result = await axios
			.get<Response<Address>>(`${PUBLIC_API_URL}/address/by/users/${userId}`, {
				withCredentials: true,
			})
			.then((response) => {
				if (response.status !== 200) throw Error(response.statusText)
				return response.data
			})

		return result.data
	}

	static async getDepartments() {
		const result = await axios
			.get<DepartmentDTOResponse>('/api/location/departamentos.php')
			.then((response) => {
				if (response.status !== 200) throw Error()
				return response.data
			})

		return DepartmentAdapter.toDepartment(result)
	}

	static async getMunicipality(departmentCode: string) {
		const result = await axios
			.get<MunicipalityDTOResponse>(
				`/api/location/municipios.php?codigo_departamento=${departmentCode}`,
				{ withCredentials: true },
			)
			.then((response) => {
				if (response.status !== 200) throw Error()
				return response.data
			})

		return MunicipalityAdapter.toMunicipality(result)
	}

	static async createAddress(createAddress: CreateAddress): Promise<Address> {
		return (
			await axios
				.post<
					Response<Address>
				>(`${PUBLIC_API_URL}/address/create`, createAddress, { withCredentials: true })
				.then((result) => {
					if (result.status !== 200) throw Error(result.statusText)

					return result.data
				})
		).data[0]
	}

	static async updateAddress(updateAddress: UpdateAddress): Promise<Address> {
		return (
			await axios
				.put<
					Response<Address>
				>(`${PUBLIC_API_URL}/address/update`, updateAddress, { withCredentials: true })
				.then((response) => {
					if (response.status !== 200) throw Error(response.statusText)
					return response.data
				})
		).data[0]
	}
}
