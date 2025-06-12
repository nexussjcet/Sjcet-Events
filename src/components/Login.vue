<template>
    <div class="login">
        <button class="logo" @click="$router.push({ name: 'Home' })">
        <img src="/logo.webp" alt="Home" width=140px data-aos="fade-right" data-aos-duration="1500">
        </button>
    <div class="login-container" data-aos="fade-up" data-aos-duration="1500">
      <h2>Login</h2>
      <form @submit.prevent="loginWithEmail">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <div style="margin-top: 1rem;">
        <span>Don't have an account?</span>
        <button @click="signUpWithEmail" style="margin-left: 0.5rem;">Sign Up</button>
      </div>
    </div>
    </div>
  </template>
  
  <script>
  import { supabase } from '../supabase';
  import { toast } from "vue3-toastify";

  import "vue3-toastify/dist/index.css";
  
  export default {
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      async loginWithEmail() {
        try {
          const { error } = await supabase.auth.signInWithPassword({
            email: this.email,
            password: this.password
          });
          if (error) throw error;
          toast.success("Login successful!", {
            theme: "dark",
            position: "top-center"
          });
          this.$router.push('/');
        } catch (error) {
          toast.error(error.message || "Login failed!", {
            theme: "dark",
            position: "top-center"
          });
        }
      },
      async signUpWithEmail() {
        if (!this.email || !this.password) {
          toast.error("Please enter both email and password.", {
            theme: "dark",
            position: "top-center"
          });
          return;
        }
        try {
          const { error } = await supabase.auth.signUp({
            email: this.email,
            password: this.password
          });
          if (error) throw error;
          toast.success("Signup successful! Please check your email to confirm.", {
            theme: "dark",
            position: "top-center"
          });
        } catch (error) {
          toast.error(error.message || "Signup failed!", {
            theme: "dark",
            position: "top-center"
          });
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