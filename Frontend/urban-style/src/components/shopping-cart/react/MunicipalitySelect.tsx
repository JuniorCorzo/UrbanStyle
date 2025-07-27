import { SelectInput } from '@/components/react/inputs/SelectInput'
import { cn } from '@/lib/cn'
import { transformToTitleCase } from '@/lib/transform-to-title-case'
import { MunicipalityStore } from '@/state/location.state'
import { useStore } from '@nanostores/react'

export function MunicipalitySelect() {
	const municipality = useStore(MunicipalityStore)
	const isDisable = !(municipality.length > 0)

	return (
		<div className="h-fit w-full px-2">
			<SelectInput
				className={cn('h-11 border-2', isDisable && 'opacity-55')}
				disable={isDisable}
				name="city"
				label="Municipios:"
				placeholder="Ej: Cúcuta"
				options={municipality?.map(({ municipalityName }) => {
					return {
						text: transformToTitleCase(municipalityName),
						value: municipalityName,
					}
				})}
			/>
		</div>
	)
}
