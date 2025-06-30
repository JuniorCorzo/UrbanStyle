import { cn } from '@/lib/cn'
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { useState, type DragEvent } from 'react'

interface Props extends React.ComponentPropsWithRef<'input'> {}

export default function FileInput({ name, ref, ...props }: Props) {
	const [isDragging, setIsDragging] = useState(false)

	const handleDragOver = (event: DragEvent) => {
		event.stopPropagation()
		event.preventDefault()
		setIsDragging(true)
	}

	const handleDragEnter = (event: DragEvent) => {
		event.stopPropagation()
		event.preventDefault()
		setIsDragging(true)
	}

	const handleDragLeave = (event: DragEvent) => {
		event.stopPropagation()
		event.preventDefault()
		setIsDragging(false)
	}

	const handleDrop = (event: DragEvent<HTMLDivElement>) => {
		setIsDragging(false)
	}

	return (
		<>
			<div
				className={cn(
					'border-crust bg-background group col-span-full flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed transition-all duration-300 ease-in-out',
					isDragging && 'animate-pulse',
				)}
				onDragEnter={handleDragEnter}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<div className="absolute flex flex-col items-center gap-5">
					<div className="text-accent flex items-center justify-center">
						<ArrowUpTrayIcon className="stroke-text size-12 transition-all ease-linear group-hover:scale-110" />
					</div>
					<span className="text-center">
						<span className="text-text block font-semibold transition-all ease-linear group-hover:scale-110">
							{isDragging
								? 'Suelta los archivos aquí'
								: 'Haz clic o arrastra archivos para subirlos'}
						</span>
					</span>
				</div>
				<input
					ref={ref}
					name={name}
					className="pointer-events-auto h-full w-full cursor-pointer opacity-0"
					type="file"
					{...props}
				/>
			</div>
		</>
	)
}
