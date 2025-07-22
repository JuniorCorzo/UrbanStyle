import { DetailItem } from '@/components/react/DetailItem'
import type { Address } from '@/interface/address.interface'

interface OrderAddressProps {
	address: Address
}

export function OrderAddress({ address }: OrderAddressProps) {
	return (
		<div className="">
			<div className="mt-2 flex max-w-sm flex-col gap-2 text-wrap">
				<DetailItem label="Dirección" value={address.street} />
				<DetailItem label="Ciudad" value={address.city} />
				<DetailItem label="Departamento" value={address.state} />
				<DetailItem label="Codigo Postal" value={address.postalCode} />
			</div>
		</div>
	)
}
