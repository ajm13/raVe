import pluginVue from 'eslint-plugin-vue'
import prettier from '@vue/eslint-config-prettier'
import globals from 'globals'

export default [
  { ignores: ['dist'] },
  ...pluginVue.configs['flat/essential'],
  prettier,
  {
    languageOptions: { globals: globals.browser },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-mutating-props': ['error', { shallowOnly: true }]
    }
  }
]
