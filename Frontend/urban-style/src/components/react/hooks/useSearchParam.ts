'use client'
import { dispatchUrlChange } from '@/lib/utils/url-change-event'
import { useEffect, useReducer, useState } from 'react'

type actions = 'SET_NEW_SEARCH_PARAM' | 'RESET_URL'

interface SearchActions {
	type: actions
	payload: {
		param: string
		value: string
	}
}

function searchReducer(state: URL | undefined, action: SearchActions) {
	const { type, payload } = action
	switch (type) {
		case 'SET_NEW_SEARCH_PARAM':
			if (!state) return state

			state.searchParams.set(payload.param, payload.value)
			return new URL(state)
		case 'RESET_URL':
			return new URL(location.href)
	}
}

export function useSearchParam() {
	const [url, dispatch] = useReducer(searchReducer, undefined)

	useEffect(() => dispatch({ type: 'RESET_URL', payload: { param: '', value: '' } }), [])

	useEffect(() => {
		history.replaceState({}, '', url)
		dispatchUrlChange()
	}, [url])

	const setSearchParam = (param: string, value: string) => {
		dispatch({
			type: 'SET_NEW_SEARCH_PARAM',
			payload: {
				param,
				value,
			},
		})
	}

	return {
		url,
		searchParam: url?.searchParams,
		setSearchParam,
		searchParamDispatch: dispatch,
	}
}
