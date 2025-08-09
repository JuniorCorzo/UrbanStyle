import type { Department, Municipality } from '@/interface/address.interface'
import { AddressService } from '@/service/address.service'
import { MunicipalityStore } from '@/state/location.state'
import { map } from 'nanostores'
import { useEffect, useState } from 'react'

export function useLocationApi() {
	const [departmentCode, setDepartmentCode] = useState<string>()
	const [departments, setDepartments] = useState<Department[]>()

	useEffect(() => {
		AddressService.getDepartments().then((departments) => setDepartments(departments))
	}, [])

	useEffect(() => {
		if (!departmentCode) {
			MunicipalityStore.set([])
			return
		}
		AddressService.getMunicipality(departmentCode).then((data) => {
			MunicipalityStore.set(data)
		})
	}, [departmentCode])

	return {
		departments,
		setDepartmentCode,
	}
}
