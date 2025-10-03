import { type DragEvent, useState } from 'react'

export function useDragging() {
	const [isDragging, setIsDragging] = useState(false)

	const handleDragEnter = (event: DragEvent) => {
		event.stopPropagation()
		event.preventDefault()

		event.dataTransfer.dropEffect = 'copy'
		setIsDragging(true)
	}

	const handleDragLeave = (event: DragEvent) => {
		event.stopPropagation()
		event.preventDefault()
		setIsDragging(false)
	}

	const handleDrop = (event: DragEvent, callback?: () => void) => {
		event.preventDefault()
		event.stopPropagation()

		if (callback) callback()

		setIsDragging(false)
	}

	return {
		isDragging,
		handleDrag: handleDragEnter,
		handleDragLeave,
		handleDrop
	}
}