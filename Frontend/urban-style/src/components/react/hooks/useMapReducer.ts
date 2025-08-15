import { useCallback, useReducer } from 'react'

export type ActionsType = 'UPDATE_VALUE'

export type Payload<T> = {
	key: keyof T
	value: string
}

export type Actions<T> = {
	type: ActionsType
	payload: Payload<T>
}

export const reducer = <T>(state: Payload<T>[], actions: Actions<T>) => {
	const { type, payload } = actions
	const { key, value } = payload

	switch (type) {
		case 'UPDATE_VALUE': {
			const index = state.findIndex((state) => state.key === key)
			if (index === -1) return [...state, { key, value }]

			return state.map((item, i) => (index === i ? { ...item, value } : item))
		}
		default:
			return state
	}
}

export const useMapReducer = <T>(initialize: Payload<T>[] = []) => {
	const [formState, dispatch] = useReducer(reducer<T>, initialize)

	const updateValue = (key: keyof T, value: string) => {
		dispatch({
			type: 'UPDATE_VALUE',
			payload: { key, value },
		})
	}

	console.log(formState)
	const getValueByKey = (key: keyof T) => {
		const index = formState.findIndex((state) => state.key === key)
		if (index === -1) return
		const stateValue = formState[index].value
		console.log(stateValue)
		return stateValue
	}

	return {
		formState: {
			getAll: () => formState,
			get: getValueByKey,
		},
		updateValue,
	}
}
