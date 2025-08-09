import TextInput from '@/components/react/inputs/TextInput'
import { DepartmentSelect } from '@/components/shopping-cart/react/DepartmentSelect'
import { MunicipalitySelect } from '@/components/shopping-cart/react/MunicipalitySelect'
import { useAddressFieldForm } from '../hooks/useAddressFieldForm'
import type { FormFieldsProps } from '@/components/dashboard/react/components/FormSidebar'
import type { Address } from '@/interface/address.interface'
import { useMemo } from 'react'

export function AddressFieldForm({ getDefaultValues }: FormFieldsProps<Address>) {
	const defaultValue = useMemo(() => getDefaultValues(), [getDefaultValues])

	const { handleInputChange, handleSelectChange, departmentSelectRef, municipalitySelectRef } =
		useAddressFieldForm(defaultValue)

	return (
		<>
			<TextInput
				name="street"
				label="Dirección completa"
				placeholder="Ej: Calle 10 #15-45, Apto 302"
				onChange={(event) => handleInputChange(event, 'street')}
				defaultValue={defaultValue?.street}
			/>
			<DepartmentSelect
				className="border"
				ref={departmentSelectRef}
				onChange={(selectItem) => handleSelectChange(selectItem, 'state')}
			/>
			<MunicipalitySelect
				className="border"
				ref={municipalitySelectRef}
				onChange={(selectItem) => handleSelectChange(selectItem, 'city')}
			/>
			<TextInput
				name="postalCode"
				label="Codigo postal"
				placeholder="Ej: 540001"
				onChange={(event) => handleInputChange(event, 'postalCode')}
				defaultValue={defaultValue?.postalCode}
			/>
		</>
	)
}
