module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "react/no-unescaped-entities": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "no-console": "warn",
    "no-unused-vars": "warn",
    "no-mixed-spaces-and-tabs": 0,
  },
};
