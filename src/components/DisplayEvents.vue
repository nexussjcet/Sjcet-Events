<template>
  <transition name="slide-left"> 
    <div class="events-container background-image" v-if="isVisible"> 
      <button @click="handleAuth" class="auth-btn" data-aos="fade-right" data-aos-duration="1500">
        {{ isLoggedIn ? 'Logout' : 'Login' }}
      </button>
      <a @click="navigateWithTransition('Home')">
        <img src="/logo.webp" alt="SJCET Logo" class="logo" height="90px" data-aos="fade-right" data-aos-duration="1500">
      </a>
      <br />
      <h1 class="events-header" data-aos="fade-down" data-aos-duration="1500">LIST OF EVENTS</h1>
      <div class="search-container" data-aos="fade-down" data-aos-duration="1500">
        <input v-model="searchQuery" placeholder="Search for Events" />
      </div>
      <div class="action-buttons" data-aos="fade-down" data-aos-duration="1500">
        <button 
          v-if="isLoggedIn"
          class="request-event-btn"
          @click="$router.push({ name: 'RequestEvent' })"
        >
          Request New Event
        </button>
      </div>
      <div class="events-section" data-aos="fade-up" data-aos-duration="2000">
        <h2 class="section-title">Upcoming Events</h2>
        <div class="cards-container">
          <div v-if="isLoading" class="loading-spinner">
            <div class="spinner"></div>
          </div>
          <div v-else-if="upcomingEvents.length === 0" class="no-events-message">
            No upcoming events at the moment
          </div>
          <div
            class="event-card"
            v-for="event in upcomingEvents"
            :key="event.id"
            data-aos="fade-up"
            data-aos-duration="300"
          >
            <div class="poster-container" v-if="event.posterURL">
              <img 
                :src="event.posterURL" 
                alt="Event Poster" 
                class="event-poster"
                @error="handleImageError" 
                @load="handleImageLoad"
              />
            </div>
            <div class="card-header">
              <div class="organizer-info">
                <span class="dot" :style="{ backgroundColor: randomColor(event.clubName) }"></span>
                <span class="organizer-name">{{ event.clubName }}</span>
              </div>
              <h2 class="card-title">{{ event.eventName }}</h2>
            </div>
            <div class="card-content">
              <p class="card-descr">{{ event.furthDetails }}</p>
              <div>
                <div class="dates-container">
                  <p>Register before:</p>
                  <p>{{ formattedRegLastDate(event.regLastDate) }}</p>
                </div>
                <div class="dates-container">
                  <p>Event Date:</p>
                  <p>{{ formattedEventDate(event.date) }}</p>
                </div>
                <div class="card-footer">
                  <div class="event-status" :class="getEventStatus(event.date)">
                    {{ getEventStatusText(event.date) }}
                  </div>
                  <button
                    class="card-button"
                    @click="$router.push({ name: 'EventDetails', params: { id: event.id } })"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="events-section past-events" data-aos="fade-up" data-aos-duration="2000">
        <h2 class="section-title">Past Events</h2>
        <div class="cards-container">
          <div v-if="isLoading" class="loading-spinner">
            <div class="spinner"></div>
          </div>
          <div v-else-if="pastEvents.length === 0" class="no-events-message">
            No past events to display
          </div>
          <div
            class="event-card past"
            v-for="event in pastEvents"
            :key="event.id"
            data-aos="fade-up"
            data-aos-duration="300"
          >
            <div class="poster-container" v-if="event.posterURL">
              <img 
                :src="event.posterURL" 
                alt="Event Poster" 
                class="event-poster"
                @error="handleImageError" 
                @load="handleImageLoad"
              />
            </div>
            <div class="card-header">
              <div class="organizer-info">
                <span class="dot" :style="{ backgroundColor: randomColor(event.clubName) }"></span>
                <span class="organizer-name">{{ event.clubName }}</span>
              </div>
              <h2 class="card-title">{{ event.eventName }}</h2>
            </div>
            <div class="card-content">
              <p class="card-descr">{{ event.furthDetails }}</p>
              <div>
                <div class="dates-container">
                  <p>Register before:</p>
                  <p>{{ formattedRegLastDate(event.regLastDate) }}</p>
                </div>
                <div class="dates-container">
                  <p>Event Date:</p>
                  <p>{{ formattedEventDate(event.date) }}</p>
                </div>
                <div class="card-footer">
                  <div class="event-status" :class="getEventStatus(event.date)">
                    {{ getEventStatusText(event.date) }}
                  </div>
                  <button
                    class="card-button"
                    @click="$router.push({ name: 'EventDetails', params: { id: event.id } })"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { signInWithGoogle } from '../firebase';
import { toast } from "vue3-toastify";
import { ref, onMounted } from 'vue';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      searchQuery: '',
      eventList: [],
      colorCache: {},
      isLoggedIn: false,
      isAdmin: false,
      isLoading: true,
      isVisible: true  
    };
  },
  mounted() {
    this.fetchEvents();
    auth.onAuthStateChanged(async (user) => {
      this.isLoggedIn = !!user;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          this.isAdmin = userDoc.data().role === 'admin';
        }
      } else {
        this.isAdmin = false;
      }
    });
  },
  methods: {
    async fetchEvents() {
      try {
        const eventCollection = collection(db, "events");
        const eventListSnapshot = await getDocs(eventCollection);
        this.eventList = eventListSnapshot.docs.map(doc => {
          const data = { id: doc.id, ...doc.data() };
          return data;
        });
        this.isLoading = false;
      } catch (error) {
        console.error("Error fetching events: ", error);
        this.isLoading = false;
      }
    },
    randomColor(organizer) {
      const r = () => Math.floor(256 * Math.random());
      const color = this.colorCache[organizer] || (this.colorCache[organizer] = `rgb(${r()}, ${r()}, ${r()})`);
      return color;
    },
    formattedRegLastDate(dateString) {
      const dateObject = new Date(dateString);
      const month = dateObject.toLocaleDateString('en-GB', { month: 'short' });
      return `${dateObject.getDate()} ${month} ${dateObject.getFullYear()}`;
    },
    formattedEventDate(dateString) {
      const dateObject = new Date(dateString);
      const month = dateObject.toLocaleDateString('en-GB', { month: 'short' });
      return `${dateObject.getDate()} ${month} ${dateObject.getFullYear()}`;
    },
    async handleAuth() {
      if (this.isLoggedIn) {
        await this.handleLogout();
      } else {
        await this.handleLoginWithGoogle();
      }
    },
    async handleLogout() {
      try {
        await signOut(auth);
        toast.success("Logged out successfully", {
          theme: "dark",
          position: "top-center"
        });
        this.isAdmin = false;
      } catch (error) {
        toast.error("Error logging out", {
          theme: "dark",
          position: "top-center"
        });
      }
    },
    async handleLoginWithGoogle() {
      try {
        await signInWithGoogle();
        toast.success("Logged in successfully", {
          theme: "dark",
          position: "top-center"
        });
      } catch (error) {
        toast.error("Authentication error!", {
          theme: "dark",
          position: "top-center"
        });
      }
    },
    navigateWithTransition(routeName) {
      this.isVisible = false; 
      setTimeout(() => {
        this.$router.push({ name: routeName });
      }, 500); 
    }, 
    getEventStatus(eventDate) {
      const today = new Date();
      const eventDateTime = new Date(eventDate);
      return eventDateTime >= today ? 'ongoing' : 'over';
    },

    getEventStatusText(eventDate) {
      return this.getEventStatus(eventDate) === 'ongoing' ? 'Ongoing' : 'Event Over';
    },
    handleImageError(e) {
      console.error('Image failed to load:', e.target.src);
    },
    handleImageLoad() {
      console.log('Image loaded successfully');
    }
  },
  computed: {
    filteredEvents() {
      return this.eventList.filter(event => 
        event.eventName && event.eventName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    upcomingEvents() {
      const today = new Date();
      return this.filteredEvents
        .filter(event => new Date(event.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    },
    pastEvents() {
      const today = new Date();
      return this.filteredEvents
        .filter(event => new Date(event.date) < today)
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.background-image {
  background-image: url('/bg1invert.jpg'); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed; 
}

.events-container {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 0; 
  text-align: center;
  overflow: hidden;
  color: #BABABA; 
}

.events-container::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.6), transparent); 
  z-index: 0;
}

.logo {
  position: absolute;
  top: 20px;
  left: 20px;
  max-width: 120px;
  height: auto;
  z-index: 1;
}

.logo:hover {
  cursor: pointer;
  text-decoration: underline;
}

.events-header {
  margin-top: 80px; 
  font-size: 2.5rem;
}

.search-container {
  margin-top: 20px; 
}

.search-container input {
  background-color: rgba(0, 0, 0, 0.8); 
  color: #BABABA; 
  border: 2px solid #1A1A1A; 
  border-radius: 8px;
  padding: 10px;
  width: 300px;
  font-family: 'Roboto', sans-serif;
}

.search-container input:focus,
.search-container input:hover {
  border-color: #D4AF37; 
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; 
  padding: 20px 0;
  gap: 20px;
}

.event-card {
  background-color: rgba(26, 26, 26, 0.85); 
  color: #BABABA; 
  border: 2px solid #D4AF37; 
  margin: 10px;
  width: 300px;
  height: auto;
  min-height: 350px;
  padding: 16px;
  border-radius: 8px;
  position: relative; 
  transition: box-shadow 0.4s ease-in-out, transform 0.4s ease-in-out;
}

.event-card:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.4); 
  transform: translateY(-5px);
}

.card-header {
  margin-top: 0;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
}

.card-title {
  color: #D4AF37; 
  font-size: 1.4rem;
  margin-bottom: 12px; 
  align-self: center;
  margin-top: 10px; 
}

.card-content {
  flex-grow: 1; 
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.card-footer {
  position: absolute;
  bottom: 16px; 
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center; 
  font-size: 1rem;
  color: #BABABA;
}

.card-button {
  background-color: transparent; 
  color: #D4AF37; 
  padding: 5px 30px;
  border-radius: 8px;
  border: 2px solid #D4AF37; 
  cursor: pointer;
  font-size: 1rem;
  transition: 0.4s;
}

.card-button:hover {
  background-color: #D4AF37; 
  color: #1A1A1A; 
}

.regfee {
  color: #D4AF37; 
}

.dates-container {
  margin-top: 10px; 
  flex-grow: 0; 
}

.auth-btn {
  background-color: rgba(26, 26, 26, 0.9); 
  color: #D4AF37; 
  border: 1px solid #D4AF37;
  padding: 10px 20px;
  border-radius: 8px;
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 1rem;
  transition: 0.3s;
}

.auth-btn:hover {
  background-color: #D4AF37; 
  color: #1A1A1A; 
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 0.5s ease-in-out;
}

.slide-left-enter-from {
    transform: translateX(-100%);
}

.slide-left-leave-to {
    transform: translateX(100%);
}

.slide-right-enter-from {
    transform: translateX(100%);
}

.slide-right-leave-to {
    transform: translateX(-100%);
}

@media (max-width: 1024px) {
  .search-container input {
    width: 80%;
  }

  .event-card {
    width: 280px;
    height: 320px;
  }

  .events-header {
    font-size: 2.5rem;
  }

  .auth-btn {
    padding: 8px 18px;
    font-size: 0.95rem;
  }
}

@media (max-width: 768px) {
  .logo {
    left: 10px;
  }

  .search-container input {
    width: 70%;
  }

  .event-card {
    width: 100%;
    height: 320px;
  }

  .events-header {
    font-size: 2rem;
  }

  .card-button {
    padding: 5px 20px;
  }

  .auth-btn {
    top: 10px;
    right: 10px;
  }
}

@media (max-width: 480px) {
  .search-container input {
    width: 90%;
  }

  .event-card {
    width: 100%;
    height: 280px;
  }

  .events-header {
    font-size: 1.8rem;
  }

  .main-desc {
    font-size: 0.9rem;
    margin-top: 5px;
  }

  .card-button {
    padding: 5px 15px;
    font-size: 0.9rem;
  }

  .auth-btn {
    top: 10px;
    right: 10px;
    font-size: 0.9rem;
    padding: 8px 18px;
  }
}

.event-status {
  padding: 5px 15px;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
  min-width: 100px;
}

.ongoing {
  background-color: #18df43;
  color: #000;
}

.over {
  background-color: #ff4444;
  color: #fff;
}

.card-footer {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  color: #BABABA;
}

.action-buttons {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.request-event-btn {
  background-color: transparent;
  color: #D4AF37;
  padding: 10px 25px;
  border-radius: 8px;
  border: 2px solid #D4AF37;
  cursor: pointer;
  font-size: 1.1rem;
  transition: 0.4s;
  font-family: 'Roboto', sans-serif;
}

.request-event-btn:hover {
  background-color: #D4AF37;
  color: #1A1A1A;
  transform: translateY(-2px);
}

.poster-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
  margin-bottom: 1rem;
}

.event-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.event-card:hover .event-poster {
  transform: scale(1.05);
}

.events-section {
  margin: 2rem 0;
}

.section-title {
  color: #D4AF37;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: #D4AF37;
  border-radius: 2px;
}

.past-events {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.past-events .event-card {
  opacity: 0.8;
  filter: grayscale(20%);
  transition: all 0.3s ease;
}

.past-events .event-card:hover {
  opacity: 1;
  filter: grayscale(0%);
}

.no-events-message {
  text-align: center;
  color: #BABABA;
  padding: 2rem;
  background: rgba(26, 26, 26, 0.85);
  border-radius: 8px;
  border: 1px solid #D4AF37;
  margin: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }

  .section-title::after {
    width: 60px;
  }

  .events-section {
    margin: 1rem 0;
  }

  .past-events {
    margin-top: 2rem;
    padding-top: 1rem;
  }
}
</style>