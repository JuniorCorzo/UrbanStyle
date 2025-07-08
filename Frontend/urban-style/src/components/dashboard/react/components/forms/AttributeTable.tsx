import { cn } from '@/lib/cn'
import { CheckIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { Attributes } from '@/interface/product.interface'
import {
	useEffect,
	useRef,
	useState,
	type ChangeEvent,
	type InputEvent,
	type KeyboardEvent,
} from 'react'
import type { BooleanField } from 'node_modules/astro/dist/env/schema'

interface AttributesWithId extends Attributes {
	id: string
}

interface AttributeTableProps {
	attributes: AttributesWithId[]
	canActions?: boolean
	onRemove?: (id: string) => void
	onChangeQuantity?: (id: string, quantity: number) => void
}

export function AttributeTable({
	attributes,
	canActions = true,
	onRemove,
	onChangeQuantity,
}: AttributeTableProps) {
	const [isEditStock, setIsEditStock] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const idEditable = useRef<string>(null)

	const handleEdit = (id: string) => {
		if (isEditStock) return

		idEditable.current = id
		setIsEditStock(true)
	}

	const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault()
		const value = event.currentTarget.value
		event.currentTarget.value = value.replaceAll(/\D/g, '')
	}

	const handleKey = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && idEditable.current) {
			event.preventDefault()
			handleDone()
		}
	}

	const handleDone = () => {
		if (!onChangeQuantity || !idEditable.current || !inputRef.current) return
		onChangeQuantity(idEditable.current, Number(inputRef.current.value))
		setIsEditStock(false)
	}

	const isEditable = (id: string) =>
		isEditStock && !!idEditable.current && idEditable.current === id

	useEffect(() => {
		if (isEditStock && inputRef.current) {
			inputRef.current.focus()
			inputRef.current.select()
		}
	}, [isEditStock])

	return (
		<div className={cn('flex flex-col')}>
			<table className="shadow-accent border-border text-text table-auto border-separate border-spacing-0 rounded border text-center shadow">
				<thead className="bg-accent h-10">
					<tr>
						<th>Color</th>
						<th>Tallas</th>
						<th className="w-32">Stock</th>
						{canActions && <th className="w-5"></th>}
					</tr>
				</thead>
				<tbody className="">
					{attributes.length === 0 && (
						<tr className="h-10">
							<td colSpan={4}>
								<span>No tienes atributos</span>
							</td>
						</tr>
					)}
					{attributes.map(({ id, color, size, quantity }) => (
						<tr className="border-border backdrop-blur-xs hover:bg-foreground h-10" key={id}>
							<td className="">{color}</td>
							<td>{size}</td>
							<td>
								{isEditable(id) ? (
									<input
										ref={inputRef}
										className="border-border focus:custom-ring w-14 border px-0.5"
										onChange={handleChangeInput}
										onKeyDown={handleKey}
										accept="/\D/g"
										defaultValue={quantity}
									/>
								) : (
									<span>{quantity}</span>
								)}
							</td>
							{canActions && (
								<td className={cn('flex h-10 items-center gap-3 px-4')}>
									<span className="group cursor-pointer">
										{isEditable(id) ? (
											<CheckIcon
												className="group-hover:scale-120 size-5"
												title="Hecho"
												onClick={handleDone}
											/>
										) : (
											<PencilIcon
												className={cn(
													'group-hover:scale-120 size-5',
													isEditStock && 'cursor-no-drop group-hover:scale-100',
												)}
												title="Modificar el stock"
												onClick={() => handleEdit(id)}
											/>
										)}
									</span>
									<span
										className="group cursor-pointer"
										title="Eliminar atributo"
										onClick={() => onRemove && onRemove(id)}
									>
										<TrashIcon className="group-hover:scale-120 size-5" />
									</span>
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
