import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import Login from '../components/Login.vue';
import EventDetails from '../components/EventDetails.vue'; 
import AddEventForm from '../components/AddEventForm.vue';
import DisplayEvents from  '../components/DisplayEvents.vue';
import { supabase } from '../supabase';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const routes = [
    { 
        name: "Home", 
        path: '/', 
        component: HomePage,
    },

    { 
        name:"EventDetails", 
        path: '/event-details/:id', 
        component: EventDetails, 
        props: true 
    },
    { 
        name: "AddEventForm",
        path: '/add-event', 
        component: AddEventForm,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    { 
        name: "DisplayEvents", 
        path: '/display-event', 
        component: DisplayEvents,
    },
    { 
        name: "Login", 
        path: '/login', 
        component: Login,
    },
    { 
        name: "NoAccess", 
        path: '/no-access', 
        component: () => import('../components/NoAccess.vue') 
    },
];

const router = createRouter({
 history: createWebHistory(),
 routes,
});


router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const { data: { user } } = await supabase.auth.getUser();

  if (requiresAuth && !user) {
    return next('/login');
  }

  if (requiresAuth && requiresAdmin) {
    // Fetch user profile from Supabase
    const { data, error } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (data && data.role === 'admin') {
      return next();
    } else {
      return next('/no-access');
    }
  }
  return next();
});
export default router;
