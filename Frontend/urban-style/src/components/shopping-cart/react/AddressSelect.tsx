import { SelectInput } from '@/components/react/inputs/SelectInput'
import { AddressService } from '@/service/address.service'
import { AddressStore } from '@/state/address.state'
import { useStore } from '@nanostores/react'
import { useEffect } from 'react'

interface Props {
	userId: string
}

export function AddressSelect({ userId }: Props) {
	const address = useStore(AddressStore)

	useEffect(() => {
		AddressService.getAddressByUserId(userId).then((response) => {
			if (!response.success) throw new Error(response.error.toString())
			AddressStore.set(response.data)
		})
	}, [])

	return (
		<SelectInput
			name="address"
			placeholder="Dirección de envío"
			options={address?.map(({ id, street, city }) => {
				return { value: id, text: `${street}, ${city}` }
			})}
		/>
	)
}
