type Props = {
	title: string
	description?: string
}

export function HeaderSection({ title, description }: Props) {
	return (
		<div className="flex h-full flex-col gap-1">
			<span className="text-lg font-medium leading-relaxed tracking-wide">{title}</span>
			{description && <p className="text-base text-gray-500">{description}</p>}
		</div>
	)
}
