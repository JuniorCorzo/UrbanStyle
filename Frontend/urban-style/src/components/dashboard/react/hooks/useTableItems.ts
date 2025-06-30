import type { ITable } from '@/interface/table-mediator.interface'
import { selectMediator } from '@/lib/utils/select-mediator'
import type { ColumnDef } from '@tanstack/table-core'
import { useEffect, useState } from 'react'

export function useTableItems() {
	const [tableConfig, setTableConfig] = useState<ITable>()

	const getTableConfig = async () => {
		const table = (await selectMediator())?.table.tableConfig()
		if (!table) return
		handleTable(table.tableConfig)
	}

	const handleTable = (tableConfig: ITable) => {
		const actionsColumns: ColumnDef<unknown> = {
			id: 'actions',
			header: 'Acciones',
		}

		tableConfig?.setOptions((prev: any) => ({
			...prev,
			columns: [...prev.columns, actionsColumns],
		}))

		setTableConfig(tableConfig)
	}

	useEffect(() => {
		window.addEventListener('change-mediator', getTableConfig)
		getTableConfig()
		return () => window.removeEventListener('change-mediator', getTableConfig)
	}, [])

	return {
		tableConfig,
	}
}
