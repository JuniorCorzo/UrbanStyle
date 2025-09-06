import type { SelectOptions } from '@/interface/form-mediator.interface'
import { showErrorOnlyField } from '@/lib/showErrorMessages'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import type { ZodObject, ZodRawShape } from 'zod'

type useFormHandlerProps<T> = {
	initializerData?: T
	validate?: ZodObject<ZodRawShape>
}

export const useFormHandler = <T>(initial?: useFormHandlerProps<T>) => {
	type ObjectKeys = keyof T
	const { initializerData, validate } = initial ?? {}
	const [formState, setFormState] = useState<Partial<T>>(initializerData ?? {})
	const [canSubmit, setSubmit] = useState(false)

	useEffect(() => {
		if (initializerData) setFormState(initializerData)
	}, [initializerData])

	const updateValue = (key: ObjectKeys, value: string) => {
		setFormState((prev) => ({ ...prev, [key]: value }))
	}

	const resetValues = () => setFormState({})

	const validateValue = <T>(key: ObjectKeys, value: T) => {
		const state = { ...formState, [key]: value }
		const valid = validate?.safeParse(state)

		if (valid?.error) showErrorOnlyField(valid.error, key)
		setSubmit(valid?.success ?? false)
	}

	const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { value, name } = event.target
		const key = name as ObjectKeys
		updateValue(key, value)

		if (validate) validateValue(key, value)
	}

	const handleSelectChange = (selectedOption: SelectOptions | null, key: ObjectKeys) => {
		const value = selectedOption?.text ?? ''
		updateValue(key, value)

		if (validate) validateValue(key, value)
	}

	const getValueByKey = (key: keyof T) => {
		if (formState) return formState[key]
	}

	return {
		formState: {
			getAll: () => formState,
			get: getValueByKey,
		},
		updateValue,
		resetValues,
		validateValue,
		handleInputChange,
		handleSelectChange,
		canSubmit,
		setSubmit,
	}
}
