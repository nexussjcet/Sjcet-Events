import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import { auth, onAuthStateChanged } from './firebase';

import { plugin as formKitPlugin, defaultConfig } from '@formkit/vue'
import { createAutoHeightTextareaPlugin } from '@formkit/addons'
import { createMultiStepPlugin } from '@formkit/addons'
import '@formkit/themes/genesis'
import '@formkit/addons/css/multistep'

let app = createApp(App)
.use(router)
.use(formKitPlugin, defaultConfig({
  plugins: [createMultiStepPlugin(),
    createAutoHeightTextareaPlugin()
   ]
}))
.mount('#app')

onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App).use(router).mount('#app');
  }
});