export default [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "lib/standxRuntime.js"],
  },
  {
    files: ["app/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: "readonly",
      },
    },
    rules: {},
  },
];
