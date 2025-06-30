import SelectInput from '@/components/react/inputs/SelectInput'
import { transformToTitleCase } from '@/lib/transform-to-title-case'
import { MunicipalityStore } from '@/state/location.state'
import { useStore } from '@nanostores/react'

export function MunicipalitySelect() {
	const municipality = useStore(MunicipalityStore)

	return (
		<div className="h-fit w-full px-2">
			<SelectInput
				className="h-11 border-2"
				disable={!(municipality.length > 0)}
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
