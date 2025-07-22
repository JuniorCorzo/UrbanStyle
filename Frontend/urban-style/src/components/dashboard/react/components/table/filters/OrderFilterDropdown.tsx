import { PAYMENT_METHOD, type PaymentMethod } from '@/interface/orders.interface'
import { Dropdown } from '../../Dropdown'
import { FilterItem } from './FilterItem'
import { getPaymentMethod } from '@/const/orders.const'
import { ComboboxInput, type ComboboxRefProps } from '@/components/react/inputs/ComboboxInput'
import { useStore } from '@nanostores/react'
import { customerStore } from '@/state/order.state'
import type { SelectOptions } from '@/interface/form-mediator.interface'
import { tableStore } from '@/state/table.state'

export function OrderFilterDropdown() {
	const customers = useStore(customerStore)
	const handleChangeCustomers = (customer: SelectOptions | null) => {
		console.log(customer)
		if (!customer) return
		const columnsFilters =
			tableStore.get().columnFilters?.filter(({ id }) => id !== 'customer.username') ?? []

		tableStore.setKey('columnFilters', [
			...columnsFilters,
			{ id: 'customer.username', value: customer.text },
		])
	}
	return (
		<>
			<Dropdown
				className="select-none px-4 py-2 text-left text-sm uppercase tracking-wide"
				label="métodos de pago"
			>
				<Dropdown.Menu className="border-0 border-b px-5 pb-2 shadow-none">
					{Object.keys(PAYMENT_METHOD).map((method) => (
						<FilterItem
							value={method}
							label={getPaymentMethod(method as PaymentMethod)}
							columnId="paymentMethod"
						/>
					))}
				</Dropdown.Menu>
			</Dropdown>
			<Dropdown
				className="select-none px-4 py-2 text-left text-sm uppercase tracking-wide"
				label="clientes"
			>
				<Dropdown.Menu className="border-0 border-b px-5 pb-2 shadow-none">
					<ComboboxInput
						isMultiple={false}
						placeholder="Clientes"
						options={customers.map(({ userId, username }) => ({ value: userId, text: username }))}
						onChange={handleChangeCustomers}
						isFloating={false}
					/>
				</Dropdown.Menu>
			</Dropdown>
		</>
	)
}
