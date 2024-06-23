<template>
    <a @click="$router.push({ name: 'Home'})">
        <img src="/logo.webp" alt="SJCET Logo" class="logo" height="90px" data-aos="fade-right" data-aos-duration="1500">
    </a>
    <br/>
    <br/>
    <h1 class="events-header" data-aos="fade-down" data-aos-duration="1500">LIST OF EVENTS</h1>
    <p class="main-desc" data-aos="fade-down" data-aos-duration="1500">Here is the list of all the events happening at SJCET</p>
    <div class="cards-container" data-aos="fade-up" data-aos-duration="2000">
      <!-- Event Cards -->
      <div class="event-card" v-for="event in eventList" :key="event.id" data-aos="fade-up" data-aos-duration="2000">
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
              <p>{{ event.regLastDate }}</p>
            </div>
            <div class="dates-container">
              <p>Event Date:</p>
              <p>{{ event.date }}</p>
            </div>
            <div class="card-footer">
              <h4 class="regfee">Rs. {{ event.regFee }}</h4>
              <button class="card-button" @click="$router.push({ name: 'EventDetails', params: { id: event.id } })">Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { db } from '../firebase';
import { getDocs, collection } from 'firebase/firestore';

export default {
  data() {
    return {
      eventList: [],
      colorCache: {},
    };
  },
  mounted() {
    this.fetchEvents();
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
</style>


