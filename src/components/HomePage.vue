<template>
  <div class="home-container background-image">
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
          @click="navigateToRoute('AddEventForm')"
        >
          + Add Event
        </button>
        <button
          class="display-event-btn"
          @click="navigateToRoute('DisplayEvents')"
        >
          Display Events
        </button>
      </div>
    </div>
    <footer class="footer">
      <p>&copy; 2025 SJCET. All rights reserved.</p>
    </footer>
  </div>
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

    const navigateToRoute = (routeName) => {
      router.push({ name: routeName });
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
      navigateToRoute,
    };
  },
};
</script>

<style scoped>
/* All existing styles remain the same, except removing transition-related styles */
.background-image {
  background-image: url('/bg1.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  width: 100%;
  position: relative;
}

.home-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  padding: 2em 1em;
  position: relative;
  width: 100%;
  color: #f5f5dc;
  z-index: 1;
}

.home-container::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.8) 100%);
  z-index: 0;
}

.logo-home {
  position: fixed;
  top: 20px;
  left: 20px;
  max-width: 120px;
  height: auto;
  z-index: 10;
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
  z-index: 2;
  position: relative;
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
  z-index: 2;
}

.main-buttons {
  display: flex;
  justify-content: center;
  gap: 1em;
  z-index: 2;
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
  position: fixed;
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
  z-index: 10;
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
  z-index: 2;
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

@media (max-width: 1024px) {
  .home-container {
    padding: 1em;
  }

  .title {
    font-size: 3rem;
    margin-top: 60px;
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
    margin-top: 70px;
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
    margin-top: 80px;
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
    position: fixed;
    z-index: 10;
  }

  .logo-home {
    width: 100px;
    top: 10px;
    left: 10px;
    position: fixed;
    z-index: 10;
  }

  .footer {
    padding: 1em;
  }

  .footer p {
    font-size: 0.9rem;
  }
}
</style>