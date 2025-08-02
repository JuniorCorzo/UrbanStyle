import type { IDashboardStrategy } from '@/interface/dashboard-strategy.interface'
import { orderTable } from '../mediators/order-table.mediator'
import { setOrderStats } from '@/state/order.state'

export class OrderStrategy implements IDashboardStrategy {
	execute() {
		orderTable()
		setOrderStats().get()
	}
}
