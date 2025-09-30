export const SEMVER_TYPE = {
	MAJOR: {
		value: "MAJOR",
		label: "Major"
	},
	MINOR: {
		value: "MINOR",
		label: "Minor"
	},
	PATCH: {
		value: "PATCH",
		label: "Patch"
	}
} as const

export type SemverType = keyof typeof SEMVER_TYPE;