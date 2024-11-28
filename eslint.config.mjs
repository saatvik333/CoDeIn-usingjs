import globals from 'globals'
import pluginJs from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['**/*.js'], languageOptions: { sourceType: 'module' } },
    { languageOptions: { globals: { ...globals.browser, process: 'readonly' } } },
    pluginJs.configs.recommended,
    {
        rules: {
            'no-unused-vars': 'off',
            'no-undef': ['error', { typeof: true }]
        }
    },
    eslintConfigPrettier
]
