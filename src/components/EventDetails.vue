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
      const [hours, minutes] = this.event.time.split(':');
      const eventDate = new Date(this.event.date);
      const startTime = new Date(eventDate.setHours(Number(hours), Number(minutes)));
      const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000));

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
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.home-container {
  min-height: 100vh;
  background-image: url('/bg1.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  padding: 2em 1em;
  color: #f5f5dc;
  position: relative;
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

.display-event-btn {
  border: none;
  font-size: 2rem;
  padding: 5px;
  margin: 10px;
  cursor: pointer;
  background-color: transparent;
  color: #D4AF37;
  transition: 0.3s;
  position: relative;
  z-index: 2;
}

.display-event-btn:hover {
  color: #E6D19D;
  text-decoration: underline;
}

.event-container {
  width: 60%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #D4AF37;
  padding: 40px;
  border-radius: 12px;
  background-color: rgba(40, 40, 40, 0.9);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 2;
}

.event-title {
  font-family: 'Roboto', sans-serif;
  font-size: 2.5rem;
  color: #E6D19D;
  font-weight: 700;
  text-shadow: 0 0 12px rgba(0, 0, 0, 0.8);
}

.intro {
  color: #D4AF37;
  font-size: 1.2rem;
  margin-bottom: 0.5em;
}

.mode {
  color: #BABABA;
  font-size: 1.1rem;
  margin-top: 0.5em;
}

.mt {
  margin-top: 1.5em;
  color: #BABABA;
}

.mentor-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #BABABA;
}

.medium {
  font-weight: 500;
  color: #D4AF37;
}

.reglink {
  color: #1A1A1A;
  text-decoration: none;
  font-weight: 500;
  background: #D4AF37;
  padding: 0.5em 2em;
  margin-top: 2em;
  display: inline-block;
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: 400;
  font-family: 'Roboto', sans-serif;
  transition: 0.3s;
}

.reglink:hover {
  background: #E6D19D;
  color: #1A1A1A;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
}

.calendar-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2em 0;
}

.calendar-btn {
  padding: 0.5em 1em;
  border: 1px solid #D4AF37;
  border-radius: 8px;
  background-color: transparent;
  color: #D4AF37;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  transition: 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.calendar-btn:hover {
  background-color: #444444;
  color: #E6D19D;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
}

.calendar-btn i {
  font-size: 1.1rem;
}

@media (max-width: 991px) {
  .event-container {
    width: 80%;
  }
  
  .home-container {
    min-height: 100vh;
    background-position: center;
    background-size: cover;
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 1em;
  }

  .event-container {
    width: 90%;
    padding: 20px;
  }

  .event-title {
    font-size: 2rem;
  }

  .display-event-btn {
    font-size: 1.5rem;
    margin: 5px;
  }

  .calendar-buttons {
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
  }

  .calendar-btn {
    width: 100%;
    justify-content: center;
    font-size: 0.9rem;
  }

  .reglink {
    font-size: 1.2rem;
    padding: 10px 30px;
    margin: 30px auto;
    display: block;
    width: fit-content;
  }

  .mt {
    margin-top: 20px;
  }
}

@media (max-width: 480px) {
  .event-container {
    width: 95%;
    padding: 15px;
  }

  .event-title {
    font-size: 1.8rem;
  }

  .intro {
    font-size: 1rem;
  }

  .mode {
    font-size: 0.9rem;
  }

  .display-event-btn {
    font-size: 1.2rem;
  }

  .calendar-btn {
    font-size: 0.8rem;
  }

  .reglink {
    font-size: 1.1rem;
    padding: 8px 25px;
  }
}
</style>