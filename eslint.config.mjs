import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'prettier', // Desactiva reglas de ESLint que pueden entrar en conflicto con Prettier
  ),
  {
    files: ['*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off', // ✅ Desactiva para .js
    },
  },
]

export default eslintConfig
