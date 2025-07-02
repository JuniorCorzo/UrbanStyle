import eslintPluginAstro from 'eslint-plugin-astro'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
	...eslintPluginAstro.configs.recommended,
	{
		rules: {
			'comma-dangle': ['error', 'always-multiline'],
		},
	},
	globalIgnores(['.dist/']),
])
