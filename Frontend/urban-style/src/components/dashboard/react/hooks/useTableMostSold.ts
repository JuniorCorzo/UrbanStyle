import type { ITable } from '@/interface/table-mediator.interface'
import { selectMediator } from '@/lib/utils/select-mediator'
import { useEffect, useState } from 'react'

export function useTableMostSold() {
	const [tableConfig, setTableConfig] = useState<ITable>()

	const getTableConfig = async () => {
		const table = (await selectMediator())?.table.mostSoldTable()
		if (!table) return
		setTableConfig(table.tableConfig)
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
