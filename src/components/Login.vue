<template>
    <div class="login">
        <button class="logo" @click="$router.push({ name: 'Home' })">
        <img src="/logo.webp" alt="Home" width=140px data-aos="fade-right" data-aos-duration="1500">
        </button>
    <div class="login-container" data-aos="fade-up" data-aos-duration="1500">
      <h2>Organizer Login</h2>
      <form @submit.prevent="loginWithEmail">
        <button @click="loginWithGoogle">Login with College Email-ID</button>
      </form>
    </div>
    </div>
  </template>
  
  <script>
  import { signInWithGoogle } from '../firebase';
  import { toast } from "vue3-toastify";

  import "vue3-toastify/dist/index.css";
  
  export default {
    methods: {
      async loginWithGoogle() {
        try {
          await signInWithGoogle();
          this.$router.push('/');
        } catch (error) {
          toast("Authentication error!!", {
          "theme": "dark",
          "type": "error",
          "position": "top-center",
          "dangerouslyHTMLString": true
        })
        }
        }
        }
        }
  </script>

<style>
.login {
    height: 100vh;
    background-image: linear-gradient(360deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 0.5) 80%, rgba(0, 0, 0, 0.3) 100%), url(/sjcet.webp); 
    background-size: cover;
    background-position: center;
    align-items: center;
    justify-content: center;
    display: flex;
}

.logo {
  position: absolute;
  top: 20px;
  left: 20px;
  border: none;
  font-size: 1rem;
  color: #18df43;
  background-color: transparent;
}

.logo :hover {
  cursor: pointer;
  text-decoration: underline;
}

.login-container {
    width: 100%;
    max-width: 400px;
    background-color: rgba(255, 255, 255, 0.692);
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    align-items: center;
    justify-content: center;
}

.login-container h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
    color: #207823; 
}

.login-container form {
    display: flex;
    flex-direction: column;
}

.login-container label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #4caf50; 
}

.login-container input {
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ccccccba;
    border-radius: 4px;
}

.login-container button {
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    background-color: #18df43;
    color: rgb(25, 24, 24);
    font-size: 1rem;
    cursor: pointer;
    transition: 0.4s;
}

.login-container button:hover {
    background-color: #101210;
    color: #18df43;
    transition: 0.4s;
}

.login-container .google-button {
    margin-top: 1rem;
    background-color: #18df43;
    color: #161716;
    transition: 0.4s;
}

.login-container .google-button:hover {
    background-color: #151615; 
    color: #18df43;
    transition: 0.4s;
}

@media (max-width: 991px) {
    .login-container {
        max-width: 300px;
    }
}
</style>