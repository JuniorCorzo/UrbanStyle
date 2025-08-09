import { Button } from '@/components/react/Button'
import {
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from '@heroicons/react/24/outline'
import type { Table } from '@tanstack/react-table'

interface Props {
	tableConfig: Table<unknown>
}

export function TablePagination({ tableConfig }: Props) {
	return (
		<div className="bg-accent flex py-3">
			<div className="flex w-full justify-center gap-2">
				<Button
					size="custom"
					className="bg-accent flex aspect-square size-10 items-center justify-center disabled:cursor-no-drop disabled:opacity-70 disabled:shadow-none"
					onClick={() => tableConfig.firstPage()}
					disabled={!tableConfig.getCanPreviousPage()}
				>
					<ChevronDoubleLeftIcon className="size-9" />
				</Button>
				<Button
					size="custom"
					className="bg-accent flex aspect-square size-10 items-center justify-center disabled:cursor-no-drop disabled:opacity-70 disabled:shadow-none"
					onClick={() => tableConfig.previousPage()}
					disabled={!tableConfig.getCanPreviousPage()}
				>
					<ChevronLeftIcon className="size-9" />
				</Button>
				<span className="bg-background border-border text-text flex aspect-square h-10 items-center text-nowrap rounded border px-5 font-medium">
					<span>{`${tableConfig.getState().pagination.pageIndex + 1} de ${tableConfig.getPageCount()}`}</span>
				</span>
				<Button
					size="custom"
					className="bg-accent flex aspect-square size-10 items-center justify-center disabled:cursor-no-drop disabled:opacity-70 disabled:shadow-none"
					onClick={() => tableConfig.nextPage()}
					disabled={!tableConfig.getCanNextPage()}
				>
					<ChevronRightIcon className="pointer-events-none size-9" />
				</Button>
				<Button
					size="custom"
					className="bg-accent flex aspect-square size-10 items-center justify-center disabled:cursor-no-drop disabled:opacity-70 disabled:shadow-none"
					onClick={tableConfig.lastPage}
					disabled={!tableConfig.getCanNextPage()}
					type="button"
				>
					<ChevronDoubleRightIcon className="size-9" />
				</Button>
			</div>
		</div>
	)
}
