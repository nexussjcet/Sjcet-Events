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

// Create and mount the app immediately
app = createApp(App)
  .use(router)
  .use(formKitPlugin, defaultConfig({
    plugins: [
      createMultiStepPlugin(),
      createAutoHeightTextareaPlugin()
    ]
  }));
app.mount('#app');

// Handle auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
  if (session && session.user) {
    console.log('User authenticated:', session.user);
  } else {
    console.log('User not authenticated');
  }
});