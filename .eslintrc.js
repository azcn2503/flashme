module.exports = {
  extends: "airbnb",
  rules: {
    "arrow-parens": 0,
    "comma-dangle": 0,
    "import/no-extraneous-dependencies": 0,
    "no-underscore-dangle": 0,
    "react/jsx-filename-extension": 0,
    "react/prefer-stateless-function": 0,
    "react/require-default-props": 0,
    quotes: ["error", "double"]
  },
  settings: {
    "import/resolver": {
      webpack: {
        config: "webpack.config.babel.js"
      }
    }
  }
};
