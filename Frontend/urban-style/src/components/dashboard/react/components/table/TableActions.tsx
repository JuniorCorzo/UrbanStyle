import { dispatchDeleteModal, dispatchShowSidebar } from '@/lib/utils/open-modal-event'
import { selectMediator } from '@/lib/utils/select-mediator'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'

interface Props {
	id: string
}

const TableActions: React.FC<Props> = ({ id }) => {
	const handleUpdate = async () => {
		dispatchShowSidebar(id)
	}

	const handleDelete = async () => {
		dispatchDeleteModal({
			id,
		})
	}

	return (
		<div className="flex items-center justify-center gap-2">
			<div id="edit">
				<button
					type="button"
					className="cursor-pointer"
					onClick={handleUpdate}
					aria-haspopup="true"
				>
					<PencilSquareIcon className="pointer-events-none size-6" />
				</button>
			</div>
			<div id="delete">
				<button
					type="button"
					className="cursor-pointer"
					onClick={handleDelete}
					aria-haspopup="dialog"
				>
					<TrashIcon className="pointer-events-none size-6" />
				</button>
			</div>
		</div>
	)
}

export default TableActions
