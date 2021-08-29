module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    "plugin:vue/recommended",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],

  rules: {
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
    "no-console": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },

  globals: {
    $nuxt: true,
  },

  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 6,
  },

  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
  ],
};
