<template>
  <div>
    <button v-if="isLoggedIn" @click="handleLogout" class="logout-btn" data-aos="fade-right" data-aos-duration="1500">
        Logout
    </button>
    <a @click="$router.push({ name: 'Home'})">
      <img src="/logo.webp" alt="SJCET Logo" class="logo" height="90px" data-aos="fade-right" data-aos-duration="1500">
    </a>
    <br/>
    <br/>
    <h1 class="events-header" data-aos="fade-down" data-aos-duration="1500">LIST OF EVENTS</h1>
    <p class="main-desc" data-aos="fade-down" data-aos-duration="1500">Here is the list of all the events happening at SJCET</p>
    <div class="search-container" data-aos="fade-down" data-aos-duration="1500">
      <input v-model="searchQuery" placeholder="Search for Events" />
    </div>
    <div class="cards-container" data-aos="fade-up" data-aos-duration="2000">
      <!-- Event Cards -->
      <div class="event-card" v-for="event in filteredEvents" :key="event.id" data-aos="fade-up" data-aos-duration="2000">
        <div class="card-header">
          <div class="organizer-info">
            <span class="dot" :style="{ backgroundColor: randomColor(event.organizerName) }"></span>
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
              <h4 class="regfee">Rs. {{ event.regFee }}</h4>
              <button class="card-button" @click="$router.push({ name: 'EventDetails', params: { id: event.id } })">Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { db } from '../firebase';
import { getDocs, collection } from 'firebase/firestore';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { toast } from "vue3-toastify";
import { ref, onMounted } from 'vue';

export default {
  data() {
    return {
      searchQuery: '',
      eventList: [],
      colorCache: {},
      isLoggedIn: false
    };
  },
  mounted() {
    this.fetchEvents();
    auth.onAuthStateChanged((user) => {
      this.isLoggedIn = !!user;
    });
  },
  methods: {
    async fetchEvents() {
      try {
        const eventCollection = collection(db, "events");
        const eventListSnapshot = await getDocs(eventCollection);
        this.eventList = eventListSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching events: ", error);
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
    async handleLogout() {
      try {
        await signOut(auth);
        toast.success("Logged out successfully", {
          theme: "dark",
          position: "top-center"
        });
      } catch (error) {
        toast.error("Error logging out", {
          theme: "dark",
          position: "top-center"
        });
      }
    }
  },
  computed: {
    filteredEvents() {
      return this.eventList.filter(event => 
        event.eventName && event.eventName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }
};
</script>



<style scoped>
.logo {
  position: absolute;
  top: 20px;
  left: 10px;
}

.logo:hover {
cursor: pointer;
text-decoration: underline;
}

.main-desc {
text-align: center;
font-size: 1.2rem;
color: #1c1b1b;
font-family: 'Poppins';
margin-top: 10px;
}

.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  width: 100%;
}

.search-container input {
  width: 500px;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease-in-out;
}

.search-container input {
  width: 300px;
  padding: 10px;
  border: 2px solid #cccccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease-in-out;
}

.search-container input:focus {
  outline: none;
  border-color: #18df43;
}

.search-container input::placeholder {
  color: #353030  ;
}

.search-container input:hover,
.search-container input:focus {
  border-color: #18df43;
}

.cards-container {
padding: 0 30px;
display: flex;
flex-wrap: wrap;
margin-top: 20px;
justify-content: center;
}

.organizer-name {
color: #151516;
font-family: 'Poppins';
font-weight: 500;
}

.events-header {
margin-top: 60px;
text-align: center;
font-size: 3rem;
font-family: 'Playfair Display', sans-serif;
font-weight: 500;
color: #17be3c;
}

.event-card {
margin: 10px;
width: 300px;
height: 350px;
border: 2px solid #CBD5E1;
padding: 16px;
border-radius: 8px;
background-color: #f7fafca3;
}

.event-card:hover {
box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
}

.card-header {
height: 20%;
}

.card-title {
font-family: 'Poppins', sans-serif;
font-size: 2rem;
color: #0e8227;
}

.card-content {
height: 80%;
display: flex;
flex-direction: column;
justify-content: space-between;
}

.card-descr {
margin: 10px 0 10px 0;
color: #1d1e1f;
font-size: 0.9rem;
}

.dates-container {
display: flex;
}

.dates-container p {
flex: 1;
width: 50%;
}

.card-button {
font-size: 1rem;
padding: 5px 30px;
border-radius: 8px;
border: none;
cursor: pointer;
background-color: #18df43;
color: rgb(20, 20, 20);
font-family: 'Poppins';
border: 2px solid #18df43;
transition: 0.4s;
}

.regfee {
color: #0f0e0f;
font-family: 'Poppins';
font-weight: 500;
border: 2px solid #18df43;
display: inline-block;
padding: 5px 30px;
border-radius: 8px;
}

.card-footer {
margin-top: 10px;
display: flex;
justify-content: space-between;
align-items: center;
}

.card-button:hover {
background-color: #151415;
color: #18df43;
transition: 0.4s;
}

.logout-btn {
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

.logout-btn:hover {
    background-color: #000;
    color: #18df43;
}
</style>
