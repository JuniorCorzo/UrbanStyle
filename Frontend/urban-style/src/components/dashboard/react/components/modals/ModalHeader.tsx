import { XMarkIcon } from '@heroicons/react/24/outline'

interface Props {
	handleModal: () => void
	title: string
}

export default function ModalHeader({ handleModal, title }: Props) {
	return (
		<div className="bg-accent border-border sticky top-0 z-50 flex w-full items-center justify-between border-b px-4 py-2.5 text-center">
			<h2 className="text-text text-2xl font-bold">{title}</h2>
			<button
				onClick={handleModal}
				id="button_close"
				type="button"
				className="text-text cursor-pointer"
			>
				<XMarkIcon className="size-6" />
			</button>
		</div>
	)
}
