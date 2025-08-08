import { useEffect, useMemo, useState } from 'react'
import { OptionsTab, type Options } from './OptionsTab'
import { PersonalData } from './PersonalData'
import { useSearchParam } from '@/components/react/hooks/useSearchParam'
import { UserSecurity } from './UserSecurity'

export function UserOptions() {
	const [option, setOption] = useState<Options>()
	const optionsMap: Map<Options, React.ReactNode> = useMemo(
		() =>
			new Map([
				['PERSONAL_DATA', <PersonalData />],
				['SECURITY', <UserSecurity />],
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
		<article className="flex h-full w-full grow flex-col gap-5">
			<OptionsTab />
			{optionsMap.get(option ?? 'PERSONAL_DATA')}
		</article>
	)
}
