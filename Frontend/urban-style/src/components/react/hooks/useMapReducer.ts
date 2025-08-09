import { useReducer } from 'react'

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

			state[index].value = value
			return state
		}
		default:
			return state
	}
}

export const useMapReducer = <T>() => {
	const [formState, dispatch] = useReducer(reducer<T>, [])

	const updateValue = (key: keyof T, value: string) => {
		dispatch({
			type: 'UPDATE_VALUE',
			payload: { key, value },
		})
	}

	const getValueByKey = (key: keyof T) => formState.find((state) => state.key === key)?.value

	return {
		formState: {
			get: getValueByKey,
		},
		updateValue,
	}
}
