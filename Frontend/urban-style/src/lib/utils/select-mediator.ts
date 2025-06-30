import { TABLE_MEDIATOR_METADATA } from '@/const/table-mediator.const'
import { DashboardMediator } from '../dashboard-mediator'
import type { FormMediator } from '@/interface/form-mediator.interface'
import type { ITableMediator } from '@/interface/table-mediator.interface'

export async function selectMediator(): Promise<
	| {
			table: ITableMediator
			form: FormMediator
	  }
	| undefined
> {
	const { mediatorSearchParam } = TABLE_MEDIATOR_METADATA
	const mediator = new URLSearchParams(location.search).get(mediatorSearchParam)

	return await DashboardMediator(mediator)
}
