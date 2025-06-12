import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import { supabase } from './supabase';

import { plugin as formKitPlugin, defaultConfig } from '@formkit/vue'
import { createAutoHeightTextareaPlugin } from '@formkit/addons'
import { createMultiStepPlugin } from '@formkit/addons'
import '@formkit/themes/genesis'
import '@formkit/addons/css/multistep'

let app;

supabase.auth.onAuthStateChange((event, session) => {
  if (!app) {
    app = createApp(App)
      .use(router)
      .use(formKitPlugin, defaultConfig({
        plugins: [
          createMultiStepPlugin(),
          createAutoHeightTextareaPlugin()
        ]
      }));
    app.mount('#app');
  }
  if (session && session.user) {
    console.log('User authenticated:', session.user);
  } else {
    console.log('User not authenticated');
  }
});