import eslintPluginAstro from 'eslint-plugin-astro'
import { defineConfig, globalIgnores } from 'eslint/config'
import tsParser from '@typescript-eslint/parser'

export default defineConfig([
	...eslintPluginAstro.configs.recommended,
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
	},
	{
		files: ['**/*.js', '**/*.mjs', '**/*.ts', '**/*.tsx', '**/*.astro'],
		rules: {
			'comma-dangle': ['error', 'always-multiline'],
		},
	},
	globalIgnores(['dist/']),
])
