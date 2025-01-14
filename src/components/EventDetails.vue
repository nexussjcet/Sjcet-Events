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
        <div class="calendar-buttons mt">
          <button class="calendar-btn" @click="addToGoogleCalendar">
            <i class="pi pi-calendar"></i> Add to Google Calendar
          </button>
          <button class="calendar-btn" @click="addToOutlookCalendar">
            <i class="pi pi-calendar"></i> Add to Outlook Calendar
          </button>
        </div>
        <a :href="event.regLink" target="_blank" class="reglink">Register</a>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';
import { toast } from "vue3-toastify";

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
        const eventId = this.$route.params.id;
        const eventDoc = await getDoc(doc(db, "events", eventId));
        if (eventDoc.exists()) {
          this.event = eventDoc.data();
        } else {
          console.error('Event not found');
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    },
    formatEventForCalendar() {
      // Convert event time to proper format
      const [hours, minutes] = this.event.time.split(':');
      const eventDate = new Date(this.event.date);
      const startTime = new Date(eventDate.setHours(Number(hours), Number(minutes)));
      const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000)); // Default 2 hours duration

      return {
        title: this.event.eventName,
        description: `${this.event.eventDesc}\n\nOrganized by: ${this.event.clubName}\nRegistration Link: ${this.event.regLink}`,
        start: startTime,
        end: endTime,
        location: this.event.venue
      };
    },
    addToGoogleCalendar() {
      try {
        const event = this.formatEventForCalendar();
        const url = this.createGoogleCalendarUrl(event);
        window.open(url, '_blank');
      } catch (error) {
        toast.error("Error adding to Google Calendar", {
          theme: "dark",
          position: "top-center"
        });
      }
    },
    addToOutlookCalendar() {
      try {
        const event = this.formatEventForCalendar();
        const url = this.createOutlookCalendarUrl(event);
        window.open(url, '_blank');
      } catch (error) {
        toast.error("Error adding to Outlook Calendar", {
          theme: "dark",
          position: "top-center"
        });
      }
    },
    createGoogleCalendarUrl(event) {
      const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
      const params = new URLSearchParams({
        text: event.title,
        details: event.description,
        location: event.location,
        dates: `${event.start.toISOString().replace(/[-:.]/g, '')}/${event.end.toISOString().replace(/[-:.]/g, '')}`
      });
      return `${baseUrl}&${params.toString()}`;
    },
    createOutlookCalendarUrl(event) {
      const baseUrl = 'https://outlook.live.com/calendar/0/deeplink/compose';
      const params = new URLSearchParams({
        subject: event.title,
        body: event.description,
        location: event.location,
        startdt: event.start.toISOString(),
        enddt: event.end.toISOString()
      });
      return `${baseUrl}?${params.toString()}`;
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

.calendar-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.calendar-btn {
  padding: 0.5em 1em;
  border: 2px solid #18df43;
  border-radius: 8px;
  background-color: #18df43;
  color: #000;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  transition: 0.4s;
  display: flex;
  align-items: center;
  gap: 0.5em;
} 

.calendar-btn:hover {
  background-color: #0d0d0d;
  color: #18df43;
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
.calendar-buttons {
  flex-direction: column;
  align-items: center;
}
.calendar-btn {
  width: 100%;
  justify-content: center;
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