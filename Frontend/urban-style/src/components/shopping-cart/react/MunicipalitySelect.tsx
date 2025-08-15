import { SelectInput } from '@/components/react/inputs/SelectInput'
import type { SelectRefProps, SelectSingleProps } from '@/interface/form-mediator.interface'
import { cn } from '@/lib/cn'
import { transformToTitleCase } from '@/lib/transform-to-title-case'
import { MunicipalityStore } from '@/state/location.state'
import { useStore } from '@nanostores/react'
import type React from 'react'

type MunicipalitySelectProps = SelectSingleProps & {
	ref: React.Ref<SelectRefProps>
}

export function MunicipalitySelect({
	className,
	onChange,
	ref,
	...props
}: MunicipalitySelectProps) {
	const municipality = useStore(MunicipalityStore)
	const isDisable = !(municipality.length > 0)

	return (
		<div className="h-fit w-full">
			<SelectInput
				ref={ref}
				className={cn('h-11 border-2', className, isDisable && 'opacity-55')}
				disable={isDisable}
				name="city"
				label="Municipios:"
				onChange={onChange}
				placeholder="Ej: Cúcuta"
				options={municipality?.map(({ municipalityName }) => {
					return {
						text: transformToTitleCase(municipalityName),
						value: municipalityName,
					}
				})}
				{...props}
			/>
		</div>
	)
}
