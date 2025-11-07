module.exports = {
  // Configuración base de Vue
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  
  // 💡 SECCIÓN CRÍTICA PARA EL FIX 💡
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
  
  // Otras reglas (si las hay)
  rules: {
    // ...
  }
};