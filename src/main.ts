import { createApp } from 'vue'
// TypeScript error? Run VSCode command
// TypeScript: Select TypeScript version - > Use Workspace Version
import App from './App.vue'
import './index.css'
import Element from './plugins/element'

createApp(App)
  .use(Element)
  .mount('#app')
