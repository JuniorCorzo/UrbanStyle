import { AddressAdapter } from '@/adapter/location.adapter'
import { useMapReducer } from '@/components/react/hooks/useMapReducer'
import type { Address, CreateAddress, UpdateAddress } from '@/interface/address.interface'
import type { SelectOptions, SelectRefProps } from '@/interface/form-mediator.interface'
import { showErrorOnlyField } from '@/lib/showErrorMessages'
import { AddressScheme, type AddressValidate } from '@/lib/validations/address.validations'
import { AddressService } from '@/service/address.service'
import { AddressState, AddressStore } from '@/state/address.state'
import { userStore } from '@/state/user.state'
import { useStore } from '@nanostores/react'
import { type ChangeEvent, useCallback, useEffect, useRef } from 'react'
import { useLocationApi } from '@/components/shopping-cart/react/hook/useLocationApi'
import { formStore } from '@/state/form.state'
import { Err } from '@/lib/result_pattern'
import ToasterManager from '@/lib/utils/ToasterManager'
import type { User } from '@/interface/user.interface'
import { ResponseException } from '@/exceptions/response.exception'

type AddressKey = Omit<Address, 'id' | 'country' | 'userId'>
const addressKeys: (keyof AddressKey)[] = ['street', 'city', 'state', 'postalCode'] as const

export function useAddressFieldForm(defaultValue?: Address | undefined) {
	const departmentSelectRef = useRef<SelectRefProps>(null)
	const municipalitySelectRef = useRef<SelectRefProps>(null)

	const { formState: addressFieldsState, updateValue } = useMapReducer<AddressKey>([])
	const { departments, setDepartmentCode } = useLocationApi()

	const user = useStore(userStore)
	const { isVisible: isFormVisible } = useStore(formStore)

	const updateAddressFields = useCallback(() => {
		if (!defaultValue) return

		addressKeys.forEach((key) => {
			if (defaultValue[key]) {
				updateValue(key, defaultValue[key])
			}
		})
	}, [defaultValue, addressKeys])

	const setupDepartment = useCallback(() => {
		if (!defaultValue?.state || !departments || !departmentSelectRef.current?.setSelectedItem)
			return

		const department = departments.find(
			(department) => department.departmentName.toUpperCase() === defaultValue.state.toUpperCase(),
		)
		if (!department) return

		departmentSelectRef.current.setSelectedItem({
			text: defaultValue.state,
			value: department.departmentCode,
		})
	}, [defaultValue?.state, departments])

	const setupMunicipality = useCallback(() => {
		if (!defaultValue?.city || !municipalitySelectRef.current?.setSelectedItem) return

		municipalitySelectRef.current.setSelectedItem({
			text: defaultValue.city,
			value: defaultValue.city,
		})
	}, [defaultValue?.city])

	const resetDepartment = useCallback(() => {
		if (departmentSelectRef.current?.setSelectedItem) {
			departmentSelectRef.current.setSelectedItem(null)
			setDepartmentCode(undefined)
		}
	}, [])

	const resetMunicipality = useCallback(() => {
		if (municipalitySelectRef.current?.setSelectedItem) {
			municipalitySelectRef.current.setSelectedItem(null)
		}
	}, [])

	const resetAllFields = useCallback(() => {
		resetDepartment()
		resetMunicipality()
	}, [resetDepartment, resetMunicipality])

	useEffect(() => {
		if (!defaultValue || !departments) return

		updateAddressFields()
		setupDepartment()
		setupMunicipality()
	}, [defaultValue, departments, updateAddressFields, setupDepartment, setupMunicipality])

	const validateFields = useCallback(
		(key: keyof AddressKey, value: string) => {
			const addressData: Partial<AddressValidate> = {
				street: addressFieldsState.get('street'),
				city: addressFieldsState.get('city'),
				state: addressFieldsState.get('state'),
				postalCode: addressFieldsState.get('postalCode'),
				[key]: value,
			}
			const addressValid = AddressScheme.safeParse(addressData)
			if (addressValid.error) showErrorOnlyField(addressValid.error, key)
			if (addressValid.success) formStore.setKey('sendData', sendRequest)
		},
		[addressFieldsState],
	)

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>, key: keyof AddressKey) => {
		const value = event.target.value
		updateValue(key, value)
		validateFields(key, value)
	}

	const handleSelectChange = (selectItem: SelectOptions | null, key: keyof AddressKey) => {
		const value = selectItem?.text ?? ''
		updateValue(key, value)
		validateFields(key, value)
	}

	const handleUpdateAddress = (addressUpdate: UpdateAddress) =>
		AddressService.updateAddress(addressUpdate).then((response) => {
			if (!response.success) throw new ResponseException(response.error)
			AddressStore.set([...AddressStore.get(), response.data])
			console.log('address updated')
		})

	const handleCreateAddress = (user: User, address: CreateAddress) =>
		AddressService.createAddress(
			AddressAdapter.toAddress(address as AddressValidate, user.id),
		).then((response) => {
			if (!response.success) throw new ResponseException(response.error)
			AddressStore.set([...AddressStore.get(), response.data])
			console.log('Address created')
		})

	const sendRequest = (_?: FormData, id?: string) => {
		if (!user) return

		const address: Partial<AddressValidate> = {
			street: addressFieldsState.get('street'),
			city: addressFieldsState.get('city'),
			state: addressFieldsState.get('state'),
			postalCode: addressFieldsState.get('postalCode'),
		}

		if (id) {
			const addressUpdate = AddressAdapter.toAddressUpdate(address as AddressValidate, user.id, id)
			ToasterManager.emitPromise({
				promise: handleUpdateAddress(addressUpdate),
				config: {
					success: 'Dirección actualizada con éxito',
					error: 'Hubo un error actualizando la dirección, intente mas tarde',
				},
			})
			return
		}

		ToasterManager.emitPromise({
			promise: handleCreateAddress(
				user,
				AddressAdapter.toAddress(address as AddressValidate, user.id),
			),
			config: {
				success: 'Dirección creada con éxito',
				error: 'Ha ocurrió un error creando la dirección, intente mas tarde',
			},
		})
	}

	// useEffect(() => formStore.setKey('sendData', sendRequest), [addressFieldsState])

	useEffect(() => {
		if (isFormVisible) return

		resetAllFields()
	}, [isFormVisible, resetAllFields])

	return {
		addressFieldsState,
		handleInputChange,
		handleSelectChange,
		sendRequest,
		departmentSelectRef,
		municipalitySelectRef,
	}
}
