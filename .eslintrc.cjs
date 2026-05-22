// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off', // JSX automático
    'prettier/prettier': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      // Forbid importing the server-only Supabase client from components and routes.
      // Only src/server/** and src/services/** are allowed to import it.
      // This prevents accidental inclusion of SUPABASE_SERVICE_ROLE_KEY in the browser bundle.
      // See REQ-SERVER-CLIENT-1 / design §ADR-4.
      files: ['src/components/**/*.{ts,tsx}', 'src/routes/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@everyone-web/libs/supabase.server', '**/libs/supabase.server'],
                message:
                  'supabase.server is server-only. Import it only from src/server/** or src/services/**.',
              },
            ],
          },
        ],
      },
    },
  ],
};
