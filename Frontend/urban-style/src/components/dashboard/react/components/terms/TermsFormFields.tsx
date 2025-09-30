import { VariantSelector } from '@/components/react/VariantSelector.tsx'
import { useState } from 'react'
import { SEMVER_TYPE, type SemverType } from '@/const/terms.const.ts'
import { TermsInput } from '@/components/dashboard/react/components/terms/TermsInput.tsx'
import { MessageError } from '@/components/react/inputs/MessageError.tsx'

export function TermsFormFields() {
	const [semverType, setSemverType] = useState<SemverType>('MAJOR')
	return (
		<>
			<div className="flex max-w-sm flex-col gap-1">
				<h3 className="font-medium">Impacto de cambio:</h3>
				<MessageError errorId={'semver_error'} />
				<div className="inline-flex max-w-full flex-wrap gap-3">
					<VariantSelector
						value={SEMVER_TYPE.MAJOR.value}
						text={SEMVER_TYPE.MAJOR.label}
						selected={semverType === 'MAJOR'}
						onSelect={() => setSemverType('MAJOR')}
					/>
					<VariantSelector
						value={SEMVER_TYPE.MINOR.value}
						text={SEMVER_TYPE.MINOR.label}
						selected={semverType === 'MINOR'}
						onSelect={() => setSemverType('MINOR')}
					/>
					<VariantSelector
						value={SEMVER_TYPE.PATCH.value}
						text={SEMVER_TYPE.PATCH.label}
						selected={semverType === 'PATCH'}
						onSelect={() => setSemverType('PATCH')}
					/>
				</div>
				<a href="/guides/terms" target="_blank" className="text-sm text-gray-500 hover:underline">
					Guía de etiquetas y versiones.
				</a>
			</div>
			<TermsInput />
		</>
	)
}
