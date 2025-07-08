import { Cell } from '@/components/dashboard/react/components/table/Cell'
import type { ITable } from '@/interface/table-mediator.interface'
import { cn } from '@/lib/cn'
import { tableStore } from '@/state/table.state'
import { useStore } from '@nanostores/react'
import { flexRender } from '@tanstack/react-table'
import { Fragment } from 'react'

interface Props {
	tableConfig: ITable
}

export function Table({ tableConfig }: Props) {
	const { subComponent } = useStore(tableStore)
	const getPreviousColumn = (accessorKey: string) => {
		const columnIndex = tableConfig.getAllColumns().findIndex(({ id }) => id === accessorKey)
		return tableConfig.getAllColumns()[columnIndex - 1]
	}

	return (
		<table className="border-border w-full table-fixed border">
			<thead className="bg-accent h-11 text-center">
				{tableConfig.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<th
								className={cn(
									'h-11 px-2 uppercase',
									header.column.getIsPinned() === 'left' && 'bg-accent sticky',
									header.column.getIsPinned() === 'right' && 'bg-accent sticky',
								)}
								key={header.id}
								colSpan={header.colSpan}
								style={{
									width: header.column.getSize(),
									left:
										header.column.getIsPinned() === 'left'
											? (getPreviousColumn(header.column.id)?.getSize() ?? 0)
											: '',
									right:
										header.column.getIsPinned() === 'right'
											? (getPreviousColumn(header.column.id)?.getSize() ?? 0)
											: '',
								}}
							>
								{header.isPlaceholder
									? null
									: flexRender(header.column.columnDef?.header, header.getContext())}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody>
				{tableConfig.getRowModel().rows.map((row) => (
					<Fragment key={row.id}>
						<tr
							className="group h-full cursor-pointer"
							key={row.id}
							onClick={row.getToggleExpandedHandler()}
						>
							{row.getVisibleCells().map((cell) => (
								<Cell
									key={cell.id}
									className={cn(
										cell.column.getIsPinned() === 'left' && 'bg-background sticky left-0 z-10',
										cell.column.getIsPinned() === 'right' && 'bg-background sticky right-0',
									)}
									style={{
										width: cell.column.getSize(),
										left:
											cell.column.getIsPinned() === 'left'
												? (getPreviousColumn(cell.column.id)?.getSize() ?? 0)
												: '',
										right:
											cell.column.getIsPinned() === 'right'
												? (getPreviousColumn(cell.column.id)?.getSize() ?? 0)
												: '',
									}}
								>
									{cell.getIsPlaceholder()
										? null
										: flexRender(cell.column.columnDef.cell, cell.getContext())}
								</Cell>
							))}
						</tr>
						{row.getIsExpanded() && subComponent ? (
							<tr>
								<td className="bg-foreground px-5" colSpan={row.getVisibleCells().length}>
									{subComponent({ row })}
								</td>
							</tr>
						) : null}
					</Fragment>
				))}
			</tbody>
		</table>
	)
}
