import type {
	Address,
	CreateAddress,
	Department,
	DepartmentDTOResponse,
	Municipality,
	MunicipalityDTOResponse,
	UpdateAddress,
} from '@/interface/address.interface'
import type { AddressValidate } from '@/lib/validations/address.validations'

export class AddressAdapter {
	static toAddress(address: AddressValidate, userId: string): CreateAddress {
		const { city, postalCode, state, street } = address

		return {
			userId,
			street,
			city,
			state,
			postalCode,
			country: 'Colombia',
		}
	}

	static toAddressUpdate(address: AddressValidate, userId: string, id: string): UpdateAddress {
		return {
			...this.toAddress(address, userId),
			id,
		}
	}
}

export class DepartmentAdapter {
	static toDepartment(departmentDTO: DepartmentDTOResponse): Department[] {
		return departmentDTO.resultado.map(({ CODIGO_DEPARTAMENTO, NOMBRE_DEPARTAMENTO }) => {
			return {
				departmentCode: CODIGO_DEPARTAMENTO,
				departmentName: NOMBRE_DEPARTAMENTO,
			}
		})
	}
}

export class MunicipalityAdapter {
	static toMunicipality(municipalityDTO: MunicipalityDTOResponse): Municipality[] {
		return municipalityDTO.resultado.map(({ NOMBRE_MUNICIPIO }) => {
			return {
				municipalityName: NOMBRE_MUNICIPIO,
			}
		})
	}
}
