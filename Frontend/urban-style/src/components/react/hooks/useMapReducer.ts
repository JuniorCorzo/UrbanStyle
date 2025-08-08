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

export const reducer = <T>(state: Map<keyof T, string>, actions: Actions<T>) => {
	const { type, payload } = actions
	const { key, value } = payload

	switch (type) {
		case 'UPDATE_VALUE': {
			const newState = new Map(state)
			newState.set(key, value)
			return newState
		}
		default:
			return state
	}
}

export const useMapReducer = <T>(initialState: Map<keyof T, string> = new Map()) => {
	const [formState, dispatch] = useReducer(reducer<T>, initialState)

	const updateValue = (key: keyof T, value: string) => {
		dispatch({
			type: 'UPDATE_VALUE',
			payload: { key, value },
		})
	}

	return { formState, updateValue }
}
