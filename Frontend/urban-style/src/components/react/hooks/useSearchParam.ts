"use client";
import { useEffect, useReducer, useState } from "react";

type actions = "SET_NEW_SEARCH_PARAM" | "RESET_URL";

interface SearchActions {
  type: actions;
  payload: {
    param: string;
    value: string;
  };
}

function searchReducer(state: URL | undefined, action: SearchActions) {
  const { type, payload } = action;
  switch (type) {
    case "SET_NEW_SEARCH_PARAM":
      if (!state) return state;

      state.searchParams.set(payload.param, payload.value);
      return new URL(state);
    case "RESET_URL":
      return new URL(location.href);
  }
}

export function useSearchParam(key: string = "") {
  const [url, dispatch] = useReducer(searchReducer, undefined);

  useEffect(
    () => dispatch({ type: "RESET_URL", payload: { param: "", value: "" } }),
    []
  );

  useEffect(() => {
    history.pushState({}, "", url);
  }, [url]);

  const setSearchParam = (param: string, value: string) => {
    dispatch({
      type: "SET_NEW_SEARCH_PARAM",
      payload: {
        param,
        value,
      },
    });
  };

  return {
    searchParam: url?.searchParams,
    setSearchParam,
  };
}
