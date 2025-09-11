import { AddressAdapter } from '@/adapter/location.adapter'
import { useFormHandler } from '@/components/react/hooks/useFormHandler'
import type { Address, CreateAddress, UpdateAddress } from '@/interface/address.interface'
import type { SelectRefProps } from '@/interface/form-mediator.interface'
import { showErrorOnlyField } from '@/lib/showErrorMessages'
import { AddressScheme, type AddressValidate } from '@/lib/validations/address.validations'
import { AddressService } from '@/service/address.service'
import { AddressState, AddressStore } from '@/state/address.state'
import { userStore } from '@/state/user.state'
import { useStore } from '@nanostores/react'
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { useLocationApi } from '@/components/shopping-cart/react/hook/useLocationApi'
import { formStore } from '@/state/form.state'
import ToasterManager from '@/lib/utils/ToasterManager'
import type { User } from '@/interface/user.interface'
import { ResponseException } from '@/exceptions/response.exception'

type AddressKey = Omit<Address, 'id' | 'country' | 'userId'>
const addressKeys: (keyof AddressKey)[] = ['street', 'city', 'state', 'postalCode'] as const

export function useAddressFieldForm(defaultValue?: Address | undefined) {
	const departmentSelectRef = useRef<SelectRefProps>(null)
	const municipalitySelectRef = useRef<SelectRefProps>(null)

	const {
		formState: addressFieldsState,
		handleInputChange,
		handleSelectChange,
		resetValues,
		canSubmit,
	} = useFormHandler<Address>({ initializerData: defaultValue, validate: AddressScheme })
	const user = useStore(userStore)
	const { departments, setDepartmentCode } = useLocationApi()

	const { isVisible: isFormVisible } = useStore(formStore)

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
		resetValues()
		resetDepartment()
		resetMunicipality()
	}, [resetDepartment, resetMunicipality])

	useEffect(() => {
		if (!defaultValue || !departments) return

		setupDepartment()
		setupMunicipality()
	}, [defaultValue, departments, setupDepartment, setupMunicipality])

	const handleUpdateAddress = (addressUpdate: UpdateAddress) =>
		AddressService.updateAddress(addressUpdate).then((response) => {
			if (!response.success) throw new ResponseException(response.error)
			AddressState.updateAddressStore()
			console.log('address updated')
		})

	const handleCreateAddress = (user: User, address: CreateAddress) =>
		AddressService.createAddress(
			AddressAdapter.toAddress(address as AddressValidate, user.id),
		).then((response) => {
			if (!response.success) throw new ResponseException(response.error)
			AddressState.updateAddressStore()
			console.log('Address created')
		})

	const sendRequest = useCallback(
		(_?: FormData, id?: string) => {
			console.log(canSubmit)
			if (!canSubmit) {
				console.warn('hola')
				return
			}
			if (!user) return

			const addressState = addressFieldsState.getAll()
			const address: AddressValidate = {
				street: addressState.street,
				city: addressState.city,
				state: addressState.state,
				postalCode: addressState.postalCode,
			} as AddressValidate

			if (id) {
				const addressUpdate = AddressAdapter.toAddressUpdate(address, user.id, id)
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
				promise: handleCreateAddress(user, AddressAdapter.toAddress(address, user.id)),
				config: {
					success: 'Dirección creada con éxito',
					error: 'Ha ocurrió un error creando la dirección, intente mas tarde',
				},
			})
		},
		[addressFieldsState, canSubmit],
	)

	useEffect(() => {
		if (isFormVisible) return

		resetAllFields()
	}, [isFormVisible, resetAllFields])

	useLayoutEffect(() => {
		if (canSubmit) formStore.setKey('sendData', sendRequest)
	}, [canSubmit])
	return {
		address: addressFieldsState.getAll(),
		handleInputChange,
		handleSelectChange,
		sendRequest,
		departmentSelectRef,
		municipalitySelectRef,
	}
}
