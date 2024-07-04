<template>
  <div class="home-container">
    <button class="display-event-btn" data-aos="fade-right" data-aos-duration="1500" @click="$router.push({ name: 'DisplayEvents' })">
      <i class="pi pi-arrow-left"></i> Back
    </button> 
    <div class="event-container" data-aos="fade-up" data-aos-duration="2000">
      <div>
        <p class="intro" v-if="!event.collab">{{ event.clubName }}</p>
        <p class="intro" v-else>{{ event.clubName }} / {{ event.collab }}</p>
        <h1 class="event-title">{{ event.eventName }}</h1>
        <p class="mode">{{ event.mode }}</p>
        <p class="mt">{{ event.eventDesc }}</p>
        <p class="date mt"><i class="pi pi-calendar"></i> {{ event.date }}</p>
        <p><i class="pi pi-clock"></i> {{ event.time }}</p>
        <p><i class="pi pi-map-marker"></i> {{ event.venue }}</p>
        <p class="mt">About the event: {{ event.furthDetails }}</p>
        <p class="mt">Certificates issued: {{ event.certificates }}</p>
        <div class="mentor-info mt">
          <p class="medium">Mentor: </p>
          <div>
            <p class="medium">{{ event.mentor }}</p>
          </div>
        </div>
        <p class="mt">Last Date to register: {{ event.regLastDate }}</p>
        <p>Registration Fee: {{ event.regFee }}</p>
        <p class="medium mt">Contact:</p>
        <p>{{ event.organizerName }}: {{ event.phone }}</p>
        <a :href="event.regLink" target="_blank" class="reglink">Register</a>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';

import 'primeicons/primeicons.css';

export default {
  data() {
    return {
      event: {}
    };
  },
  created() {
    this.fetchEventDetails();
  },
  methods: {
    async fetchEventDetails() {
      try {
        const eventName = this.$route.params.name;
        const eventDoc = await getDoc(doc(db, "events", eventName));
        if (eventDoc.exists()) {
          this.event = eventDoc.data();
        } else {
          console.error('Event not found');
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    }
  }
};
</script>

<style scoped>
.display-event-btn {
  border: none;
  font-size: 2rem;
  padding: 5px;
  margin: 10px;
  cursor: pointer;
  background-color: transparent;
}

.display-event-btn:hover {
  color: #0e8a39;
  text-decoration: underline;
}

.event-container {
  width: 60%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #CBD5E1;
  padding: 40px;
  border-radius: 12px;
  background-color: #f7fafca3;
}

.event-title {
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
  color: #0e8227;
  font-weight: 500;
}

.mt {
  margin-top: 1.5em;
}

.mentor-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.medium {
  font-weight: 500;
}

.reglink {
  color: rgb(7, 7, 7);
  text-decoration: none;
  font-weight: 500;
  background: #18df43;
  padding: 0.5em 2em;
  margin-top: 2em;
  display: inline-block;
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: 400;
  font-family: 'Poppins', sans-serif;
  transition: 0.4s;
}

.reglink:hover {
  background: #0d0d0d;
  color: #18df43;
  transition: 0.4s;
}

@media (max-width: 768px) {
  .home-container {
    height: 100vh;
    background-size: cover;
    background-position: center;
}
.display-event-btn {
    border: none;
    font-size: 2rem;
    padding: 5px;
    margin: 10px;
    cursor: pointer;
    background-color: transparent;
}
.display-event-btn:hover {
    color: #0e8a39;
    text-decoration: underline;
}
.event-container {
    width: 60%;
    margin:     auto;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #CBD5E1;
    padding: 40px;
    border-radius: 12px;
    background-color: #f7fafca3;
}
.event-title {
    font-family: 'Poppins', sans-serif;
    font-size: 2rem;
    color: #0e8227;
    font-weight: 500;
}
.mt {
    margin-top: 24px;
}
.mentor-info {
    display: flex;
    align-items: center;
    gap: 10px;
}
.medium {
    font-weight: 500;
}
.reglink {
    color: rgb(7, 7, 7);
    text-decoration: none;
    font-weight: 500;
    background: #18df43;
    padding: 10px 30px;
    margin: 30px auto;
    display: block;
    width: fit-content;
    border-radius: 8px;
    font-size: 1.5rem;
    font-weight: 400;
    font-family: 'Poppins', sans-serif;
    transition: 0.4s;
}
.reglink:hover {
    background: #0d0d0d;
    color: #18df43;
    transition: 0.4s;
}
}
@media (max-width: 991px) {
    .event-container {
        width: 80%;
    }
    .home-container {
        display: absolute;
        background-position: center;
        background-size: cover;
        height: 100vh;
    }
}
</style>





   