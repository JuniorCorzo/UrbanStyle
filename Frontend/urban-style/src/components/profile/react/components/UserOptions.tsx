import { useEffect, useMemo, useState } from 'react'
import { OptionsTab } from './OptionsTab'
import { PersonalData } from './PersonalData'
import { UserSecurity } from './UserSecurity'
import { UserAddress } from './UserAddress'
import type { Options } from '../hooks/useOptionsTab'

export function UserOptions() {
	const [option, setOption] = useState<Options>()
	const optionsMap: Map<Options, React.ReactNode> = useMemo(
		() =>
			new Map([
				['PERSONAL_DATA', <PersonalData />],
				['SECURITY', <UserSecurity />],
				['DIRECTIONS', <UserAddress />],
			]),
		[],
	)

	const handleOption = () => {
		const searchParam = new URLSearchParams(location.search)
		setOption(searchParam.get('option')?.toUpperCase() as Options)
	}
	useEffect(() => {
		window.addEventListener('url-change', () => handleOption())
		return window.removeEventListener('url-change', () => handleOption())
	}, [])

	console.log(option)
	return (
		<article className="flex h-full w-full max-w-full grow flex-col gap-5">
			<div className="px-5">
				<OptionsTab />
			</div>
			{optionsMap.get(option ?? 'PERSONAL_DATA')}
		</article>
	)
}
