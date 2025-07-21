import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import bytes from 'bytes'
import FileInput from './FileInput'
import type { Images } from '@/interface/product.interface'
import LabelInput from './LabelInput'
import { SelectInput } from './SelectInput'
import { useImages } from '../hooks/useImages'
import { cn } from '@/lib/cn'
import { MessageError } from './MessageError'
import type { SelectOptions } from '@/interface/form-mediator.interface'

interface Props {
	label: string
	name: string
	defaultImages?: Images[]
}

export function ImagesFileInput({ name, label, defaultImages = [] }: Props) {
	const { images, attributes, inputFileRef, handleFiles, handleDeleteImage, handleChangeColor } =
		useImages(defaultImages)

	return (
		<>
			<LabelInput label={label}>
				<MessageError errorId={`${name}_error`} />
				<FileInput
					ref={inputFileRef}
					onChange={handleFiles}
					name={name}
					accept="image/**"
					multiple
				/>
			</LabelInput>
			<div className="flex w-full flex-col justify-center gap-5 overflow-visible">
				{images?.map(({ imageName, imageUrl, file, color, isUpload, isDelete }) => (
					<div
						className={cn(
							'bg-accent flex w-full flex-col gap-3 rounded-lg px-5 py-4',
							isDelete && 'hidden',
						)}
						key={imageUrl}
					>
						<div className="flex items-center justify-between gap-5">
							<img className="aspect-square size-28 rounded-md" src={imageUrl} />
							<span className="flex w-full max-w-56 flex-col gap-5">
								<h3 className="font-medium">{imageName.split('.')[0]}</h3>
								<span>{bytes(file.size, { unitSeparator: ' ' })}</span>
							</span>
							<span onClick={() => handleDeleteImage(imageUrl, isUpload)} title="Eliminar imagen">
								<TrashIcon className="stroke-red size-7 cursor-pointer hover:scale-105" />
							</span>
						</div>
						<div>
							<LabelInput label="Asignar color">
								<SelectInput
									name={imageUrl}
									placeholder="Seleccione el color"
									onChange={(selectedItem: SelectOptions | null) =>
										handleChangeColor(imageUrl, selectedItem?.text ?? '')
									}
									defaultValue={
										color ? { text: color, value: color.toLowerCase() } : undefined
									}
									options={Array.from(attributes).map((color) => ({
										text: color,
										value: color.toLowerCase(),
									}))}
								/>
							</LabelInput>
						</div>
					</div>
				))}
			</div>
		</>
	)
}
