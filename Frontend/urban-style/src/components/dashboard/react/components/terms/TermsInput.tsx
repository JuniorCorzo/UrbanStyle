import {
	ArchiveBoxArrowDownIcon,
	ArrowUpTrayIcon,
	DocumentTextIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline'
import { type ChangeEvent, type DragEvent, useLayoutEffect, useRef, useState } from 'react'
import bytes from 'bytes'
import { MessageError } from '@/components/react/inputs/MessageError.tsx'
import { useDragging } from '@/components/react/hooks/useDragging.ts'
import { toggleErrorMessage } from '@/lib/showErrorMessages'
import { $ } from '@/lib/dom-selector'

type EntryFile = {
	name: string
	size: string
}

export function TermsInput() {
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const { isDragging, handleDrag, handleDragLeave, handleDrop } = useDragging()
	const [entryFile, setEntryFile] = useState<EntryFile>()
	const [isFirefox, setFirefox] = useState(false)

	useLayoutEffect(() => {
		setFirefox(navigator.userAgent.toLowerCase().includes('firefox'))
	}, [])

	const getSizeFormat = (size: number) =>
		bytes(size, { unit: 'KB', decimalPlaces: 2, unitSeparator: ' ' }) ?? ''

	const validateFile = (file: File) => {
		const { type } = file

		if (type !== 'text/markdown') {
			toggleErrorMessage(
				'El archivo debe estar en formato Markdown (.md).',
				$<HTMLSpanElement>('#file_error')!,
			)
			return false
		}

		return true
	}

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.item(0)
		if (!file) return
		if (!validateFile(file)) return

		setEntryFile({
			name: file.name,
			size: getSizeFormat(file.size),
		})
	}

	const handleDropFile = (event: DragEvent<HTMLLabelElement>) => {
		if (!fileInputRef.current) return

		const fileDropped = event.dataTransfer?.files.item(0)
		if (fileDropped && validateFile(fileDropped)) {
			const dataTransfer = new DataTransfer()
			dataTransfer.items.add(fileDropped)

			fileInputRef.current.files = dataTransfer.files
			setEntryFile({
				name: fileDropped.name,
				size: getSizeFormat(fileDropped.size),
			})
		}
	}

	const handleDeleteFile = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		event.stopPropagation()

		if (!fileInputRef.current) return

		fileInputRef.current.files = new DataTransfer().files
		setEntryFile(undefined)
	}

	return (
		<div className="flex w-full flex-col gap-1">
			<h3 className="font-medium">Subir archivo:</h3>
			<MessageError errorId="file_error" />
			<label
				htmlFor="file_input"
				className="bg-foreground border-border flex w-full cursor-pointer flex-col items-center gap-2 rounded-md border px-3 py-2"
				onDragOver={handleDrag}
				onDragEnter={handleDrag}
				onDragLeave={handleDragLeave}
				onDrop={(event) => handleDrop(event, () => handleDropFile(event))}
			>
				{entryFile && renderWithFile(entryFile, handleDeleteFile)}
				{!entryFile && renderWithoutFile(isDragging)}
				<input
					id="file_input"
					ref={fileInputRef}
					name="file"
					type="file"
					className="hidden"
					onChange={handleFileChange}
				/>
			</label>
			{isFirefox && (
				<span className="text-text/80 text-sm">
					En Firefox no es posible arrastrar archivos Markdown (.md).
				</span>
			)}
		</div>
	)
}

const renderWithoutFile = (isDragging: boolean) => {
	return (
		<>
			<span className="flex flex-col gap-1 text-center text-lg leading-5">
				<span>Arrastre el archivo aquí</span>
				<span>o</span>
			</span>
			<span className="shadow-border inline-flex items-center gap-2 rounded-lg border border-inherit px-3 py-2 font-semibold shadow-sm">
				<ArrowUpTrayIcon className="size-6" />
				<span className="transition-all duration-200">
					{isDragging ? 'Soltar Archivo' : 'Buscar Archivo'}
				</span>
			</span>
			<span>Formato soportado: .md</span>
		</>
	)
}

const renderWithFile = (
	{ name, size }: EntryFile,
	handleDeleteFile: (event: React.MouseEvent<HTMLButtonElement>) => void,
) => {
	return (
		<div className="flex w-full items-center justify-between gap-2">
			<span className="inline-flex items-center gap-2">
				<DocumentTextIcon className="size-7" />
				<strong className="font-semibold">{name}</strong> - {size}
			</span>
			<button
				className="hover:scale-115 cursor-pointer"
				title="Eliminar archivo"
				onClick={handleDeleteFile}
			>
				<XMarkIcon className="pointer-events-none size-5" />
			</button>
		</div>
	)
}
