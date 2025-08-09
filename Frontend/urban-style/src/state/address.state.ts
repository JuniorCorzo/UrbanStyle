import type { Address } from '@/interface/address.interface'
import { AddressService } from '@/service/address.service'
import { computed, onMount } from 'nanostores'
import { persistentAtom } from '@nanostores/persistent'
import { userStore } from './user.state'

export const AddressStore = persistentAtom<Address[]>('address', [], {
	encode: JSON.stringify,
	decode: JSON.parse,
})

onMount(AddressStore, () => {
	userStore.listen((user) => {
		if (!user) {
			AddressStore.set([])
			return
		}

		AddressService.getAddressByUserId(user.id).then((address) => {
			AddressStore.set(address)
		})
	})
})

export const getAddressById = (addressId: string) =>
	computed(AddressStore, (addressList) => addressList.find(({ id }) => id === addressId))

const updateAddressStore = () => {
	const user = userStore.get()
	if (!user) return
	AddressService.getAddressByUserId(user.id).then((address) => AddressStore.set(address))
}

export const AddressState = {
	getAddressById,
	updateAddressStore,
}
