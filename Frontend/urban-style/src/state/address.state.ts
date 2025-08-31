import type { Address } from '@/interface/address.interface'
import { AddressService } from '@/service/address.service'
import { computed, onMount } from 'nanostores'
import { persistentAtom } from '@nanostores/persistent'
import { userStore } from './user.state'
import { ResponseException } from '@/exceptions/response.exception'

export const AddressStore = persistentAtom<Address[]>('address', [], {
	encode: JSON.stringify,
	decode: JSON.parse,
})

onMount(AddressStore, () => {
	updateAddressStore()
})

export const getAddressById = (addressId: string) =>
	computed(AddressStore, (addressList) => addressList.find(({ id }) => id === addressId))

const updateAddressStore = async () => {
	const user = userStore.get()
	if (!user) {
		console.error('User not found')
		return
	}

	await AddressService.getAddressByUserId(user.id).then((response) => {
		if (!response.success) throw new ResponseException(response.error)

		AddressStore.set(response.data)
	})
}

export const AddressState = {
	getAddressById,
	updateAddressStore,
}
