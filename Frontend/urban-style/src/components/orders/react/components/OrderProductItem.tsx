import { CLOUDFLARE_URL } from '@/config/env-config'
import type { ProductSummary } from '@/interface/product.interface'
import { getProductImage } from '@/lib/getImageByProductId'
import { useMemo } from 'react'

interface OrderProductProps {
	product: ProductSummary
}

export function OrderProductItem({ product }: OrderProductProps) {
	const image = useMemo(() => getProductImage(product.productId).get(), [])

	return (
		<div className="bg-background border-border shadow-border flex items-center rounded-lg border-2 shadow">
			<div className="aspect-square size-36">
				<img
					className="aspect-square size-36 rounded-bl-lg rounded-tl-lg"
					src={`${image}`}
					alt={product.name}
					decoding="async"
					width={128}
					height={128}
					loading="lazy"
				/>
			</div>
			<div className="grid w-full grid-cols-2 px-1.5">
				<div className="flex w-full grow flex-col justify-center gap-1.5 leading-5">
					<span>
						<h3 className="text-content font-medium uppercase">{product.name}</h3>
					</span>
					<span>
						Color: <strong className="font-medium">{product.color}</strong>
					</span>
					<span>
						Talla: <strong className="font-medium">{product.size}</strong>
					</span>
					<span>
						Cantidad: <strong className="font-medium">{product.quantity}</strong>
					</span>
				</div>
				<div className="flex flex-col items-end justify-center">
					<span className="flex flex-col items-center">
						<span className="font-medium">
							{new Intl.NumberFormat('es-CO', {
								style: 'currency',
								currency: 'COP',
								currencyDisplay: 'code',
							}).format(product.price * product.quantity)}
						</span>
						<span className="text-text/90 text-sm">
							(
							{new Intl.NumberFormat('es-CO', {
								style: 'decimal',
								minimumFractionDigits: 2,
							}).format(product.price)}
							c\u)
						</span>
					</span>
				</div>
			</div>
		</div>
	)
}
