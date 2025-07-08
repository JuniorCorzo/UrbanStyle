import type { Products } from '@/interface/product.interface'
import { Cell } from './Cell'
import type { SubComponentProps } from '@/interface/table-mediator.interface'
import { CLOUDFLARE_URL } from '@/config/env-config'
import { AttributeTable } from '../forms/AttributeTable'
import { ProductDetail } from './ProductDetail'

export function ProductSubComponent({ row }: SubComponentProps<Products>) {
	const { description, images, attributes } = row.original
	return (
		<div className="border-border bg-background shadow-border mx-auto my-5 flex h-full w-full flex-wrap justify-start gap-5 rounded-md border px-3 py-5 shadow-md sm:justify-center">
			<ProductDetail className="max-w-56 landscape:max-w-56 sm:landscape:max-w-xl" label="Imágenes">
				<div className="flex flex-wrap items-center justify-center gap-5 sm:max-w-md sm:justify-between">
					{images.map(({ image }) => (
						<img
							className="border-border shadow-border aspect-square size-48 rounded-2xl shadow"
							src={`${CLOUDFLARE_URL}/${image}`}
							loading="lazy"
							decoding="async"
							alt={description}
							key={image}
						/>
					))}
				</div>
			</ProductDetail>
			<div className="flex flex-col justify-center gap-5">
				<ProductDetail label="Descripción">
					<Cell.Paragraph>{description}</Cell.Paragraph>
				</ProductDetail>
				<ProductDetail label="Atributos" className="min-w-sm">
					<AttributeTable
						attributes={attributes.map((attr) => ({ ...attr, id: crypto.randomUUID().toString() }))}
						canActions={false}
					></AttributeTable>
				</ProductDetail>
			</div>
		</div>
	)
}
