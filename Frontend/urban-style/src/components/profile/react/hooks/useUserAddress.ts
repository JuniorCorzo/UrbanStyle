import { AddressForm } from '@/lib/config/address_form.config'
import { addressTable } from '@/lib/config/address_table.config'
import { AddressStore } from '@/state/address.state'
import { useStore } from '@nanostores/react'
import { useEffect } from 'react'
import { useAddressFieldForm } from './useAddressFieldForm'

export function useUserAddress() {
	const address = useStore(AddressStore)
	const { sendRequest } = useAddressFieldForm()

	useEffect(() => {
		addressTable()
		AddressForm(sendRequest)
	}, [address])
}
