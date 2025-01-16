<template>
    <div class="home-container">
        <button @click="handleAuth" class="auth-btn" data-aos="fade-right" data-aos-duration="1500">
            {{ isLoggedIn ? 'Logout' : 'Login' }}
        </button>
        <a href="#">
        <img src="/logo.webp" alt="SJCET Logo" class="logo-home" height="100px" data-aos="fade-right" data-aos-duration="1500">
        </a>
        <div class="main-container">
            <h3 class="title" data-aos="fade-up" data-aos-duration="1500">SJCET EVENTS</h3>
            <h3 class="highlight" data-aos="fade-up" data-aos-duration="2000">All college events at one place!</h3>
            <br/>
            <p class="main-para" data-aos="fade-up" data-aos-duration="2200">Stay updated on all campus happenings, from workshops to club meetings and sports events. Easily browse, RSVP to ensure you never miss out on the excitement. Enjoy exploring and engaging with our vibrant college community!</p>
            <div class="main-buttons" data-aos="fade-up" data-aos-duration="2500">
                <button 
                    class="add-event-btn"  
                    v-if="isLoggedIn && isAdmin"
                    @click="$router.push({ name: 'AddEventForm' })"
                >
                    + Add Event
                </button>
                <button class="display-event-btn" @click="$router.push({ name: 'DisplayEvents' })">Display Events</button>
            </div>
        </div>
    </div>
</template>
   
<script>
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { signInWithGoogle } from '../firebase';
import { toast } from "vue3-toastify";
import { ref, onMounted } from 'vue';
import {useRouter} from 'vue-router';
import { doc, getDoc } from 'firebase/firestore';

export default {
    setup() {
        const isLoggedIn = ref(false);
        const isAdmin = ref(false);
        const router = useRouter();

        onMounted(async () => {
            auth.onAuthStateChanged(async (user) => {
                isLoggedIn.value = !!user;
                if (user) {
                    const userRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        isAdmin.value = userDoc.data().role === 'admin'; // Set admin status
                    }
                }
            });
        });

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
                    position: "top-center"
                });
                isAdmin.value = false;
            } catch (error) {
                toast.error("Error logging out", {
                    theme: "dark",
                    position: "top-center"
                });
            }
        };

        const handleLoginWithGoogle = async () => {
            try {
                await signInWithGoogle();
                toast.success("Logged in successfully", {
                    theme: "dark",
                    position: "top-center"
                });
                router.push('/');
            } catch (error) {
                toast.error("Authentication error!", {
                    theme: "dark",
                    position: "top-center"
                });
            }
        };

        return {
            isLoggedIn,
            isAdmin,
            handleAuth
        };
    }
}
</script>

<style scoped>
.home-container {
    height: 100vh;
    background-image: linear-gradient(360deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.6) 70%, rgba(0, 0, 0, 0.4) 80%, rgba(0, 0, 0, 0.3) 100%), url(/sjcet.webp);
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1em;
    position: relative;
}

.logo-home {
    position: absolute;
    top: 20px;
    left: 20px;
}

.main-container {
    height: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 1em;
}

.title {
    font-weight: 500;
    font-size: 4rem;
    margin: 0;
    color: #18df43;
    text-decoration: underline;
}

.highlight {
    font-weight: 500;
    font-size: 2rem;
    margin: 0;
    color: #18df43;
}

.main-para {
    font-size: 1.5rem;
    color: #fdfcff;
    font-family: 'Poppins', sans-serif;
    padding: 0 20%;
}

.main-buttons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.add-event-btn, .display-event-btn {
    padding: 15px 25px;
    border: 2px solid #65d818;
    border-radius: 5px;
    transition: 0.4s;
    font-family: 'Poppins', sans-serif;
    margin: 10px;
    cursor: pointer;
    font-size: 1.5rem;
    box-shadow: rgba(159, 26, 231, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
}

.add-event-btn {
    background-color: #65d818;
    color: rgb(16, 16, 16);
}

.add-event-btn:hover {
    background-color: #0a0a0b;
    color: #65d818;
}

.display-event-btn {
    background-color: #65d818;
    color: #0c0b0b;
}

.display-event-btn:hover {
    background-color: #0d0d0d;
    color: #65d818;
}

.auth-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: #18df43;
    color: #000;
    border: 2px solid #18df43;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: 0.4s;
}

.auth-btn:hover {
    background-color: #000;
    color: #18df43;
}

@media (max-width: 768px) {
    .home-container {
        padding: 1em;
    }

    .main-para {
        font-size: 1.2rem;
        padding: 0 10%;
    }

    .title {
        font-size: 3rem;
    }

    .highlight {
        font-size: 1.5rem;
    }

    .main-buttons {
        flex-direction: column;
        padding: 0 20px;
    }

    .add-event-btn, .display-event-btn {
        font-size: 1.2rem;
        padding: 12px 20px;
    }

    .logo-home {
        top: 10px;
        left: 10px;
    }
}

@media (max-width: 480px) {
    .home-container {
        padding: 0.5em;
    }

    .main-para {
        font-size: 1rem;
        padding: 0 5%;
    }

    .title {
        font-size: 2.5rem;
    }

    .highlight {
        font-size: 1.2rem;
    }

    .add-event-btn, .display-event-btn {
        font-size: 1.2rem;
        padding: 10px 15px;
    }

    .logo-home {
        top: 5px;
        left: 5px;
    }
}
</style>
   