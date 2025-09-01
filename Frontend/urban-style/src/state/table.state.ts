import type { TableState } from '@/interface/table-mediator.interface'
import { map } from 'nanostores'

const initialState: TableState = {
	titleSection: '',
	columns: [],
	data: [],
	canSearch: true,
	hasForm: true,
}

export const tableStore = map<TableState>(initialState)
export const tableMostSoldStore = map<TableState>(initialState)
