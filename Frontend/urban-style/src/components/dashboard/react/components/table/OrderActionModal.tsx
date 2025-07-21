import React, { useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import ModalHeader from '../modals/ModalHeader'
import { SelectInput } from '@/components/react/inputs/SelectInput'
import { ORDER_STATUS, type OrderStatus } from '@/interface/orders.interface'
import { getOrderStatus } from '@/const/orders.const'
import { Button } from '@/components/react/Button'
import { OrderService } from '@/service/orders.service'
import type { SelectRefProps } from '@/interface/form-mediator.interface'
import { orderStore } from '@/state/order.state'
import { ChangeStatusScheme } from '@/lib/validations/order.validations'
import { z } from 'zod'
import { showError, toggleErrorMessage } from '@/lib/showErrorMessages'
import { $ } from '@/lib/dom-selector'
import { useOrderActionModal } from '../../hooks/useOrderActionModal'

export type OrderActionModalRef = {
	open: () => void
}

type OrderActionModalProps = {
	orderId: string
	status: OrderStatus
}

export const OrderActionModal = React.forwardRef<OrderActionModalRef, OrderActionModalProps>(
	({ orderId, status }, ref) => {
		const { dialogRef, selectRef, handleUpdateOrderStatus, handleClose } =
			useOrderActionModal(orderId)

		useImperativeHandle(ref, () => ({
			open: () => dialogRef.current?.showModal(),
		}))

		return createPortal(
			<dialog
				id={orderId}
				ref={dialogRef}
				onClick={(event) => event.stopPropagation()}
				className="bg-background -translate-1/2 min-w-sm border-border shadow-crust fixed left-1/2 top-1/2 overflow-visible rounded-md border shadow-lg"
			>
				<ModalHeader title="Cambiar" handleModal={handleClose} />
				<div className="grid grid-cols-1 gap-2 px-4 py-2.5">
					<div className="">
						<SelectInput
							ref={selectRef}
							placeholder="Estados"
							name={`status-${orderId}`}
							options={Object.keys(ORDER_STATUS)
								.filter((orderStatus) => orderStatus !== status)
								.map((status) => ({
									value: status,
									text: getOrderStatus(status as OrderStatus)?.status ?? '',
								}))}
							isFloating={false}
						/>
					</div>
					<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
						<Button
							className="bg-transparent backdrop-brightness-100"
							onClick={handleClose}
							size="sm"
						>
							Cancelar
						</Button>
						<Button size="sm" onClick={handleUpdateOrderStatus}>
							Confirmar
						</Button>
					</div>
				</div>
			</dialog>,
			document.body,
		)
	},
)
