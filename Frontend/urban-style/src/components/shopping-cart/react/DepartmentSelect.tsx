import SelectInput from '@/components/react/inputs/SelectInput'
import { useLocationApi } from './hook/useLocationApi'
import { transformToTitleCase } from '@/lib/transform-to-title-case'

export function DepartmentSelect() {
	const { departments, setDepartmentCode } = useLocationApi()

	return (
		<div className="h-fit w-full px-2">
			<SelectInput
				className="h-11 border-2"
				name="state"
				label="Departamento:"
				placeholder="Ej: Norte de Santander"
				onChange={(value) => setDepartmentCode(value)}
				options={departments?.map(({ departmentCode, departmentName }) => {
					return {
						value: departmentCode,
						text: transformToTitleCase(departmentName),
					}
				})}
			/>
		</div>
	)
}
