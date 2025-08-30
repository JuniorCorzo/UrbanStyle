import type { SelectRefProps } from '@/interface/form-mediator.interface'
import type { OrderStatus } from '@/interface/orders.interface'
import { $ } from '@/lib/dom-selector'
import { toggleErrorMessage } from '@/lib/showErrorMessages'
import { ChangeStatusScheme } from '@/lib/validations/order.validations'
import { OrderService } from '@/service/orders.service'
import { orderStore } from '@/state/order.state'
import { useRef } from 'react'

export function useOrderActionModal(orderId: string) {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const selectRef = useRef<SelectRefProps>(null)

	const handleClose = () => dialogRef.current?.close()

	const sendRequest = (orderStatus: OrderStatus) => {
		const statusValidated = ChangeStatusScheme.safeParse({ status: orderStatus })

		if (statusValidated.error) {
			toggleErrorMessage(
				statusValidated.error.issues[0].message,
				$(`#status-${orderId}_error`) as HTMLSpanElement,
			)
			return
		}

		OrderService.changeStatus(orderId, orderStatus).then((response) => {
			if (!response.success) throw new Error(response.error.toString())

			OrderService.getAllOrders().then((response) => {
				if (!response.success) throw new Error(response.error.toString())

				orderStore.set(response.data)
			})
		})
	}

	const handleUpdateOrderStatus = () => {
		if (!selectRef.current) return
		const selected = selectRef.current.selectedItems()
		const orderStatus = Array.isArray(selected)
			? (selected[0]?.value as OrderStatus)
			: (selected?.value as OrderStatus)

		sendRequest(orderStatus)
	}

	return {
		dialogRef,
		selectRef,
		handleClose,
		handleUpdateOrderStatus,
	}
}
