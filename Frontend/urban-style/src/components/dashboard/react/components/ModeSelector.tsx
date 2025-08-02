import { useSearchParam } from '@/components/react/hooks/useSearchParam'
import { Select } from '@/components/react/inputs/Select'
import type { SelectOptions, SelectRefProps } from '@/interface/form-mediator.interface'
import { TABLE_MODE, TABLE_PARAM } from '@/interface/table-mediator.interface'
import { getEnumKeyByValue } from '@/lib/utils/enum-utils'
import { getModeOptions } from '@/lib/utils/get-mode-options'
import { selectMediator } from '@/lib/utils/select-mediator'
import { useEffect, useRef } from 'react'

export function ModeSelector() {
	const { searchParam, setSearchParam } = useSearchParam()
	const selectRef = useRef<SelectRefProps>(null)
	const handleChange = (selectedItem: SelectOptions | null) => {
		if (!selectedItem) return
		setSearchParam(TABLE_PARAM.MODE, selectedItem.value)
	}

	useEffect(() => {
		selectMediator()
	}, [searchParam?.get(TABLE_PARAM.MODE)])

	useEffect(() => {
		if (!selectRef.current?.setSelectedItem) return

		const modeParam = new URLSearchParams(location.search).get(TABLE_PARAM.MODE)
		const modeKey = getEnumKeyByValue(TABLE_MODE, modeParam ?? 'all') ?? 'ALL'

		selectRef.current?.setSelectedItem({
			value: modeKey.toLocaleLowerCase(),
			text: getModeOptions(modeKey),
		})
	}, [])
	return (
		<div className="min-w-64">
			<Select
				ref={selectRef}
				className="max-h-10"
				onChange={handleChange}
				options={Object.keys(TABLE_MODE).map((mode) => ({
					text: getModeOptions(mode),
					value: mode.toLowerCase(),
				}))}
			/>
		</div>
	)
}
