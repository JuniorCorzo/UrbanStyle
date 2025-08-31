import { ResponseException } from '@/exceptions/response.exception'
import type { SendForm } from '@/interface/form-mediator.interface'
import { AddressService } from '@/service/address.service'
import { AddressState } from '@/state/address.state'
import { formStore } from '@/state/form.state'

export function AddressForm(sendRequest: SendForm) {
	const sendDelete = (id: string) => {
		AddressService.deleteAddress(id).then((response) => {
			if (!response.success) throw new ResponseException(response.error)
			console.log(response.data)
			AddressState.updateAddressStore()
		})
	}

	formStore.set({
		isVisible: false,
		formType: 'address',
		title: 'Dirección',
		sendData: sendRequest,
		sendDelete,
	})
}
