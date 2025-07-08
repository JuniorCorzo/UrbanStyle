import type { TableState } from '@/interface/table-mediator.interface'
import { map } from 'nanostores'

const initialState = {
	columns: [],
	data: [],
}

export const tableStore = map<TableState>(initialState)
export const tableMostSoldStore = map<TableState>(initialState)
