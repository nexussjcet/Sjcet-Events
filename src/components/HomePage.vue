<template>
    <transition :name="transitionName">
      <div class="home-container background-image" v-if="isVisible">
        <button @click="handleAuth" class="auth-btn" data-aos="fade-right" data-aos-duration="1500">
          {{ isLoggedIn ? 'Logout' : 'Login' }}
        </button>
        <a href="#">
          <img
            src="/logo.webp"
            alt="SJCET Logo"
            class="logo-home"
            height="80px"
            data-aos="fade-right"
            data-aos-duration="1500"
          />
        </a>
        <div class="main-container">
          <h3 class="title" data-aos="fade-up" data-aos-duration="1500">SJCET EVENTS</h3>
          <h3 class="highlight" data-aos="fade-up" data-aos-duration="2000">All college events at one place!</h3>
          <br />
          <p class="main-para" data-aos="fade-up" data-aos-duration="2200">
            Stay updated on all campus happenings, from workshops to club meetings and sports events. Easily browse,
            RSVP to ensure you never miss out on the excitement. Enjoy exploring and engaging with our vibrant college
            community!
          </p>
          <div class="main-buttons" data-aos="fade-up" data-aos-duration="2500">
            <button
              class="add-event-btn"
              v-if="isLoggedIn && isAdmin"
              @click="navigateWithTransition('AddEventForm')"
            >
              + Add Event
            </button>
            <button
              class="display-event-btn"
              @click="navigateWithTransition('DisplayEvents')"
            >
              Display Events
            </button>
          </div>
        </div>
        <footer class="footer">
          <p>&copy; 2025 SJCET. All rights reserved.</p>
        </footer>
      </div>
    </transition>
</template>
   
<script>
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { signInWithGoogle } from "../firebase";
import { toast } from "vue3-toastify";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { doc, getDoc } from "firebase/firestore";

export default {
  setup() {
    const isLoggedIn = ref(false);
    const isAdmin = ref(false);
    const isVisible = ref(true);
    const transitionName = ref('slide-right');
    const router = useRouter();

    onMounted(async () => {
      auth.onAuthStateChanged(async (user) => {
        isLoggedIn.value = !!user;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            isAdmin.value = userDoc.data().role === "admin";
          }
        }
      });
    });

    const navigateWithTransition = (routeName) => {
      transitionName.value = routeName === 'DisplayEvents' ? 'slide-right' : 'slide-left';
      isVisible.value = false;
      setTimeout(() => {
        router.push({ name: routeName });
      }, 500);
    };

    const handleAuth = async () => {
      if (isLoggedIn.value) {
        await handleLogout();
      } else {
        await handleLoginWithGoogle();
      }
    };

    const handleLogout = async () => {
      try {
        await signOut(auth);
        toast.success("Logged out successfully", {
          theme: "dark",
          position: "top-center",
        });
        isAdmin.value = false;
      } catch (error) {
        toast.error("Error logging out", {
          theme: "dark",
          position: "top-center",
        });
      }
    };

    const handleLoginWithGoogle = async () => {
      try {
        await signInWithGoogle();
        toast.success("Logged in successfully", {
          theme: "dark",
          position: "top-center",
        });
        router.push("/");
      } catch (error) {
        toast.error("Authentication error!", {
          theme: "dark",
          position: "top-center",
        });
      }
    };

    return {
      isLoggedIn,
      isAdmin,
      handleAuth,
      isVisible,
      transitionName,
      navigateWithTransition,
    };
  },
};
</script>

<style scoped>
.background-image {
  background-image: url('/bg1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.home-container {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  padding: 2em;
  text-align: center;
  overflow: hidden;
}

.home-container::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.4), transparent);
  z-index: 0;
}

.logo-home {
  position: absolute;
  top: 20px;
  left: 20px;
  max-width: 120px;
  height: auto;
  z-index: 1;
}

.main-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  flex-grow: 1;
  z-index: 1;
}

.title {
  font-weight: 700;
  font-size: 3.5rem;
  margin-bottom: 0.5em;
  color: #E6D19D;
  font-family: 'Roboto', sans-serif;
  text-shadow: 0 0 12px rgba(0, 0, 0, 0.8);
}

.highlight {
  font-weight: 400;
  font-size: 1.8rem;
  margin-bottom: 1.5em;
  color: #D4AF37;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.7);
}

.main-para {
  font-size: 1.2rem;
  color: #BABABA;
  font-family: 'Roboto', sans-serif;
  margin-bottom: 2em;
  z-index: 1;
}

.main-buttons {
  display: flex;
  justify-content: center;
  gap: 1em;
  z-index: 1;
}

.add-event-btn, .display-event-btn {
  padding: 15px 25px;
  border: 1px solid #D4AF37;
  border-radius: 8px;
  transition: 0.3s;
  font-family: 'Roboto', sans-serif;
  font-size: 1.3rem;
  cursor: pointer;
  background: transparent;
  color: #D4AF37;
}

.add-event-btn:hover, .display-event-btn:hover {
  background-color: #444444;
  color: #E6D19D;
}

.auth-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: transparent;
  color: #D4AF37;
  border: 1px solid #D4AF37;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: 0.3s;
}

.auth-btn:hover {
  background-color: #D4AF37;
  color: #1A1A1A;
}

.footer {
  width: 100%;
  padding: 1.5em;
  background-color: #282828;
  color: #BABABA;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin-top: 30px;
  z-index: 1;
  border-top: 2px solid #D4AF37;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.4);
  box-sizing: border-box;
}

.footer p {
  font-size: 1.1rem;
  margin: 0;
  font-family: 'Roboto', sans-serif;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.5s ease-in-out;
  position: absolute;
  width: 100%;
}

.slide-right-enter-from {
  transform: translateX(100%);
}

.slide-right-leave-to {
  transform: translateX(-100%);
}

.slide-left-enter-from {
  transform: translateX(-100%);
}

.slide-left-leave-to {
  transform: translateX(100%);
}

@media (max-width: 1024px) {
    .home-container {
        padding: 1em;
    }

    .title {
        font-size: 3rem;
    }

    .highlight {
        font-size: 1.5rem;
    }

    .main-para {
        font-size: 1rem;
    }

    .main-buttons {
        flex-direction: column;
    }

    .add-event-btn, .display-event-btn {
        font-size: 1.2rem;
        padding: 12px 20px;
    }

    .footer {
        padding: 1.3em;
    }

    .footer p {
        font-size: 1rem;
    }
}

@media (max-width: 768px) {
    .home-container {
        padding: 15px;
    }

    .logo-home {
        width: 100px;
    }

    .title {
        font-size: 2.5rem;
    }

    .highlight {
        font-size: 1.2rem;
    }

    .main-para {
        font-size: 1rem;
    }

    .main-buttons {
        flex-direction: column;
        align-items: center;
    }

    .add-event-btn, .display-event-btn {
        font-size: 1.1rem;
        padding: 10px 15px;
        width: 100%;
        margin: 5px 0;
    }

    .footer {
        padding: 1.2em;
    }

    .footer p {
        font-size: 0.95rem;
    }
}

@media (max-width: 480px) {
    .home-container {
        padding: 0.5em;
    }

    .title {
        font-size: 2rem;
    }

    .highlight {
        font-size: 1rem;
    }

    .main-para {
        font-size: 1rem;
        padding: 0 5%;
    }

    .add-event-btn, .display-event-btn {
        font-size: 1rem;
        padding: 10px 15px;
    }

    .auth-btn {
        font-size: 0.9rem;
        padding: 8px 15px;
        top: 10px;
        right: 10px;
    }

    .footer {
        padding: 1em;
    }

    .footer p {
        font-size: 0.9rem;
    }
}
</style>