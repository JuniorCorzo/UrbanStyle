import { ResponseException } from '@/exceptions/response.exception'
import type { Department } from '@/interface/address.interface'
import { AddressService } from '@/service/address.service'
import { MunicipalityStore } from '@/state/location.state'
import { useEffect, useState } from 'react'

export function useLocationApi() {
	const [departmentCode, setDepartmentCode] = useState<string>()
	const [departments, setDepartments] = useState<Department[]>()

	useEffect(() => {
		AddressService.getDepartments().then((response) => {
			if (!response.success) throw new ResponseException(response.error)
			setDepartments(response.data)
		})
	}, [])

	useEffect(() => {
		if (!departmentCode) {
			MunicipalityStore.set([])
			return
		}

		AddressService.getMunicipality(departmentCode).then((response) => {
			if (!response.success) throw new ResponseException(response.error)
			MunicipalityStore.set(response.data)
		})
	}, [departmentCode])

	return {
		departments,
		setDepartmentCode,
	}
}
