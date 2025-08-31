import { DepartmentAdapter, MunicipalityAdapter } from '@/adapter/location.adapter'
import { extractResponse, extractSingleResponse, obtainsError } from '@/adapter/responses.adapter'
import { PUBLIC_API_URL } from '@/config/env-config'
import type {
	Address,
	CreateAddress,
	Department,
	DepartmentDTOResponse,
	Municipality,
	MunicipalityDTOResponse,
	UpdateAddress,
} from '@/interface/address.interface'
import type { ErrorMessage, Response } from '@/interface/response.interface'
import { Err, Success, type Result } from '@/lib/result_pattern'
import axios from 'axios'

async function getAddressByUserId(userId: string): Promise<Result<Address[], ErrorMessage>> {
	const response = await axios.get<Response<Address>>(
		`${PUBLIC_API_URL}/address/by/users/${userId}`,
		{
			withCredentials: true,
		},
	)

	return extractResponse(response)
}

async function getDepartments(): Promise<Result<Department[], ErrorMessage>> {
	const response = await axios.get<DepartmentDTOResponse>('/api/location/departamentos.php')

	const { status, data: responseData } = response
	if (status !== 200) return Err('Unexpect code')

	return Success(DepartmentAdapter.toDepartment(responseData))
}

async function getMunicipality(
	departmentCode: string,
): Promise<Result<Municipality[], ErrorMessage>> {
	const { status, data: responseData } = await axios.get<MunicipalityDTOResponse>(
		`/api/location/municipios.php?codigo_departamento=${departmentCode}`,
		{ withCredentials: true },
	)

	if (status !== 200) return Err('Unexpect code')
	return Success(MunicipalityAdapter.toMunicipality(responseData))
}

async function createAddress(createAddress: CreateAddress): Promise<Result<Address, ErrorMessage>> {
	const response = await axios.post<Response<Address>>(
		`${PUBLIC_API_URL}/address/create`,
		createAddress,
		{ withCredentials: true },
	)

	return extractSingleResponse(response)
}

async function updateAddress(updateAddress: UpdateAddress): Promise<Result<Address, ErrorMessage>> {
	const response = await axios.put<Response<Address>>(
		`${PUBLIC_API_URL}/address/update`,
		updateAddress,
		{ withCredentials: true },
	)

	return extractSingleResponse(response)
}

async function deleteAddress(id: string): Promise<Result<string, ErrorMessage>> {
	const { status, data: responseData } = await axios.delete<Response>(
		`${PUBLIC_API_URL}/address/delete/${id}`,
		{
			withCredentials: true,
		},
	)
	if (status !== 200) {
		const { message } = obtainsError(responseData)
		return Err(message)
	}

	return Success(responseData.message)
}

export const AddressService = {
	getAddressByUserId,
	getMunicipality,
	getDepartments,
	createAddress,
	updateAddress,
	deleteAddress,
}
