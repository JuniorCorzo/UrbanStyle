import { Cell } from '@/components/dashboard/react/components/table/Cell'
import TableActions from '@/components/dashboard/react/components/table/TableActions'
import type { Address } from '@/interface/address.interface'
import { AddressState, AddressStore } from '@/state/address.state'
import { tableStore } from '@/state/table.state'
import { userStore } from '@/state/user.state'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { computed } from 'nanostores'

export function addressTable() {
	const columnHelper = createColumnHelper<Address>()

	const columns = [
		columnHelper.accessor('street', {
			header: 'Calle',
			cell: ({ getValue }) => <Cell.Span>{getValue()}</Cell.Span>,
		}),
		columnHelper.accessor('city', {
			header: 'Ciudad',
			cell: ({ getValue }) => <Cell.Span>{getValue()}</Cell.Span>,
		}),
		columnHelper.accessor('state', {
			header: 'Departamento',
			cell: ({ getValue }) => <Cell.Span>{getValue()}</Cell.Span>,
		}),
		columnHelper.accessor('country', {
			header: 'País',
			cell: ({ getValue }) => <Cell.Span>{getValue()}</Cell.Span>,
		}),
		columnHelper.accessor('postalCode', {
			header: 'Codigo Postal',
			cell: ({ getValue }) => <Cell.Span>{getValue()}</Cell.Span>,
		}),
		columnHelper.display({
			header: 'Acciones',
			size: 100,
			cell: (info) => <TableActions id={info.row.original.id} />,
		}),
	] as ColumnDef<unknown, any>[]

	// existe un error por el cual se obliga a hacer esto, debido a que cuando estas en otra tab,
	// por algún motivo no inicializaba bien el estado por lo que me veo obligado a volver a inicializar de nuevo
	computed(AddressStore, (address) => {
		const user = userStore.get()

		if (address.length === 0 && user) {
			AddressState.updateAddressStore()
		}

		return AddressStore.get()
	}).subscribe((address) => {
		tableStore.set({
			columns: columns,
			data: [...address],
			canSearch: true,
			hasForm: true,
		})
	})
}
