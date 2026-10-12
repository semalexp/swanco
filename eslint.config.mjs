import js from '@eslint/js';
import eslint from 'typescript-eslint';
import globals from 'globals';

export default eslint.config(
  js.configs.recommended,
  ...eslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: globals.node,
    }
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**']
  }
);
