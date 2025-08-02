export const getEnumKeyByValue = <T extends Record<string, string>>(
	enumObject: T,
	value: string,
): keyof T | undefined =>
	(Object.keys(enumObject) as (keyof T)[]).find((key) => enumObject[key] === value)
