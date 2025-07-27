import type { Products } from '@/interface/product.interface'
import { Cell } from './Cell'
import type { SubComponentProps } from '@/interface/table-mediator.interface'
import { CLOUDFLARE_URL } from '@/config/env-config'
import { AttributeTable } from '../forms/AttributeTable'
import { ProductDetail } from './ProductDetail'
import { cn } from '@/lib/cn'

export function ProductSubComponent({ row }: SubComponentProps<Products>) {
	const { description, images, attributes } = row.original
	return (
		<div className="border-border bg-background shadow-border mx-auto my-5 grid h-full w-full max-w-6xl grid-cols-2 gap-5 rounded-md border px-3 py-5 shadow-md 2xl:max-w-7xl">
			<div className="flex justify-center">
				<ProductDetail className="float-right" label="Imágenes">
					<div
						className={cn(
							'grid',
							images.length >= 2 ? 'grid-cols-2' : 'grid-cols-1 justify-center',
						)}
					>
						{images.map(({ image }) => (
							<img
								className={cn(
									'border-border shadow-border aspect-square rounded-lg shadow',
									images.length === 1 && 'w-md mx-auto',
								)}
								src={`${CLOUDFLARE_URL}/${image}`}
								loading="lazy"
								decoding="async"
								alt={description}
								key={image}
							/>
						))}
					</div>
				</ProductDetail>
			</div>
			<div className="flex w-fit flex-col justify-center gap-5">
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
