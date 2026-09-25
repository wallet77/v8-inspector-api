'use strict'

const js = require('@eslint/js')
const n = require('eslint-plugin-n')
const promise = require('eslint-plugin-promise')
const stylistic = require('@stylistic/eslint-plugin')
const globals = require('globals')

module.exports = [
    {
        ignores: ['coverage/', 'types/', '**/*.d.ts']
    },
    js.configs.recommended,
    n.configs['flat/recommended-script'],
    promise.configs['flat/recommended'],
    stylistic.configs.customize({
        indent: 4,
        quotes: 'single',
        semi: false,
        commaDangle: 'never'
    }),
    {
        rules: {
            '@stylistic/space-before-function-paren': ['error', 'always'],
            '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }]
        }
    },
    {
        files: ['tests/**/*.js'],
        languageOptions: {
            globals: globals.jest
        }
    }
]
