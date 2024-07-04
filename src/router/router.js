import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import Login from '../components/Login.vue';
import EventDetails from '../components/EventDetails.vue'; 
import AddEventForm from '../components/AddEventForm.vue';
import DisplayEvents from  '../components/DisplayEvents.vue';
import { auth, db} from '../firebase';
import { getDoc, doc } from 'firebase/firestore';
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
  const user = auth.currentUser;

  if (requiresAuth && !user) {
    return next('/login');
  }

  if (requiresAuth && requiresAdmin) {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        return next(); 
      } else {
        return next('/no-access'); 
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error("Authentication error. Please try again.", { 
        "theme": "dark",
        "type": "error",
        "position": "top-center",
        "dangerouslyHTMLString": true
      });
    }
  }

  return next(); 
});
export default router;
