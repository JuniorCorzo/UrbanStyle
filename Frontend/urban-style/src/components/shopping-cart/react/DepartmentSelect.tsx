import { SelectInput } from '@/components/react/inputs/SelectInput'
import { useLocationApi } from './hook/useLocationApi'
import { transformToTitleCase } from '@/lib/transform-to-title-case'
import type {
	SelectOptions,
	SelectRefProps,
	SelectSingleProps,
} from '@/interface/form-mediator.interface'
import type React from 'react'
import { cn } from '@/lib/cn'

type DepartmentSelectProps = SelectSingleProps & {
	ref?: React.Ref<SelectRefProps>
}

export function DepartmentSelect({ className, onChange, ref, ...props }: DepartmentSelectProps) {
	const { departments, setDepartmentCode } = useLocationApi()

	const handleChange = (selectedItem: SelectOptions | null) => {
		setDepartmentCode(selectedItem?.value)
		onChange?.(selectedItem)
	}
	return (
		<div className="h-fit w-full">
			<SelectInput
				ref={ref}
				className={cn('h-11 border-2', className)}
				name="state"
				label="Departamento:"
				placeholder="Ej: Norte de Santander"
				onChange={handleChange}
				options={departments?.map(({ departmentCode, departmentName }) => {
					return {
						value: departmentCode,
						text: transformToTitleCase(departmentName),
					}
				})}
				{...props}
			/>
		</div>
	)
}
