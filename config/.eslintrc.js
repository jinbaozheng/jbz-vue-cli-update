// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
    // '@vue/typescript'
  ],
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 'off',
    'no-debugger': 'off',
    "no-constant-condition": 1,
    "no-extend-native": "off",
    "no-new": 'off',
    "no-fallthrough": 'off',
    "no-unreachable": 1,
    "no-unused-vars": 0,
    "key-spacing": 'off',
    // 语句强制分号结尾
    "semi": 'off',
    'space-before-blocks': 'off',
    'space-before-function-paren': 'off',
    'indent': 'off',
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'vue/require-v-for-key': 'off',
    'no-undef': 'off',
    'space-infix-ops': 0
  },
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "parser": "babel-eslint"
  }
}

