import ModalHeader from './ModalHeader'
import { useDeleteModal } from '../../hooks/useDeleteModal'

export default function FormDeleteModal() {
	const { title, dialogRef, handleClose, handleOpen, handleSendRequest } = useDeleteModal()

	return (
		<dialog
			ref={dialogRef}
			onClose={handleClose}
			className={`max-h-10/12 bg-background border-border backdrop:bg-background/5 backdrop:backdrop-blur-xs focus:custom-ring inset-0 top-[50%] z-50 mx-auto h-fit w-full max-w-sm translate-y-[-50%] flex-col items-center justify-center rounded-lg border`}
		>
			<ModalHeader handleModal={handleOpen} title={`Eliminar ${title}`} />
			<section className="flex w-full flex-col items-center gap-2 px-5 pb-5 pt-2">
				<span className="text-text text-lg">¿Estas Seguro?</span>
				<article className="flex w-full justify-between">
					<button
						className="border-border focus:custom-ring hover:custom-ring text-text w-40 cursor-pointer rounded-md border py-1"
						type="button"
						onClick={handleOpen}
					>
						Cancel
					</button>
					<button
						className="bg-accent border-border focus:custom-ring hover:custom-ring text-text w-40 cursor-pointer rounded-md border py-1"
						type="button"
						onClick={handleSendRequest}
					>
						Confirmar
					</button>
				</article>
			</section>
		</dialog>
	)
}
