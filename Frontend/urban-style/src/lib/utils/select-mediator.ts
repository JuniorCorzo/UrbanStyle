import { DashboardMediator } from '../dashboard-mediator'
import type { FormMediator } from '@/interface/form-mediator.interface'
import { TABLE_PARAM, type TableConfig } from '@/interface/table-mediator.interface'

export async function selectMediator(): Promise<
	| {
			table: TableConfig
			form: FormMediator | null
	  }
	| undefined
> {
	const mode = new URLSearchParams(location.search).get(TABLE_PARAM.MODE)
	const type = new URLSearchParams(location.search).get(TABLE_PARAM.TYPE)

	return await DashboardMediator(mode, type)
}
