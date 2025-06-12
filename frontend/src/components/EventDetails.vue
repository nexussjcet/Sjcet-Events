<template>
  <div class="home-container">
    <button class="display-event-btn" data-aos="fade-right" data-aos-duration="1500" @click="$router.push({ name: 'DisplayEvents' })">
      <i class="pi pi-arrow-left"></i> Back
    </button> 
    <div class="event-container" data-aos="fade-up" data-aos-duration="2000">
      <div>
        <button v-if="isAdmin" @click="toggleEdit" class="edit-btn">
          <i class="pi" :class="isEditing ? 'pi-times' : 'pi-pencil'"></i>
          {{ isEditing ? 'Cancel' : 'Edit' }}
        </button>

        <!-- Club Name -->
        <p class="intro" v-if="!event.collab">
          <span v-if="!isEditing">{{ event.clubName }}</span>
          <input v-else v-model="editedEvent.clubName" type="text" placeholder="Club Name">
        </p>
        <p class="intro" v-else>
          <span v-if="!isEditing">{{ event.clubName }} / {{ event.collab }}</span>
          <div v-else class="collab-inputs">
            <input v-model="editedEvent.clubName" type="text" placeholder="Club Name">
            <input v-model="editedEvent.collab" type="text" placeholder="Collaborator">
          </div>
        </p>

        <!-- Event Name -->
        <h1 class="event-title">
          <span v-if="!isEditing">{{ event.eventName }}</span>
          <input v-else v-model="editedEvent.eventName" type="text" placeholder="Event Name">
        </h1>

        <!-- Mode -->
        <p class="mode">
          <span v-if="!isEditing">{{ event.mode }}</span>
          <input v-else v-model="editedEvent.mode" type="text" placeholder="Mode">
        </p>

        <!-- Event Description -->
        <p class="mt">
          <span v-if="!isEditing">{{ event.eventDesc }}</span>
          <textarea v-else v-model="editedEvent.eventDesc" placeholder="Event Description"></textarea>
        </p>

        <!-- Date and Time -->
        <p class="date mt">
          <i class="pi pi-calendar"></i>
          <span v-if="!isEditing">{{ event.date }}</span>
          <input v-else v-model="editedEvent.date" type="date">
        </p>
        <p>
          <i class="pi pi-clock"></i>
          <span v-if="!isEditing">{{ event.time }}</span>
          <input v-else v-model="editedEvent.time" type="time">
        </p>

        <!-- Venue -->
        <p>
          <i class="pi pi-map-marker"></i>
          <span v-if="!isEditing">{{ event.venue }}</span>
          <input v-else v-model="editedEvent.venue" type="text" placeholder="Venue">
        </p>

        <!-- Further Details -->
        <p class="mt">
          About the event: 
          <span v-if="!isEditing">{{ event.furthDetails }}</span>
          <textarea v-else v-model="editedEvent.furthDetails" placeholder="Further Details"></textarea>
        </p>

        <!-- Certificates -->
        <p class="mt">
          Certificates issued: 
          <span v-if="!isEditing">{{ event.certificates }}</span>
          <input v-else v-model="editedEvent.certificates" type="text" placeholder="Certificates">
        </p>

        <!-- Mentor -->
        <div class="mentor-info mt">
          <p class="medium">Mentor: </p>
          <div>
            <span v-if="!isEditing">{{ event.mentor }}</span>
            <input v-else v-model="editedEvent.mentor" type="text" placeholder="Mentor Name">
          </div>
        </div>

        <!-- Registration Details -->
        <p class="mt">
          Last Date to register: 
          <span v-if="!isEditing">{{ event.regLastDate }}</span>
          <input v-else v-model="editedEvent.regLastDate" type="date">
        </p>
        <p>
          Registration Fee: 
          <span v-if="!isEditing">{{ event.regFee }}</span>
          <input v-else v-model="editedEvent.regFee" type="number" placeholder="Registration Fee">
        </p>

        <!-- Contact Info -->
        <p class="medium mt">Contact:</p>
        <p>
          <span v-if="!isEditing">{{ event.organizerName }}: {{ event.phone }}</span>
          <div v-else class="contact-inputs">
            <input v-model="editedEvent.organizerName" type="text" placeholder="Organizer Name">
            <input v-model="editedEvent.phone" type="tel" placeholder="Phone Number">
          </div>
        </p>

        <!-- Registration Link -->
        <p v-if="isEditing" class="mt">
          Registration Link:
          <input v-model="editedEvent.regLink" type="url" placeholder="Registration Link">
        </p>

        <div class="calendar-buttons mt" v-if="!isEditing">
          <button class="calendar-btn" @click="addToGoogleCalendar">
            <i class="pi pi-calendar"></i> Add to Google Calendar
          </button>
          <button class="calendar-btn" @click="addToOutlookCalendar">
            <i class="pi pi-calendar"></i> Add to Outlook Calendar
          </button>
        </div>

        <a v-if="!isEditing" :href="event.regLink" target="_blank" class="reglink">Register</a>

        <div v-if="isEditing" class="edit-actions">
          <button @click="saveChanges" class="save-btn">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase';
import { toast } from "vue3-toastify";
import 'primeicons/primeicons.css';

export default {
  data() {
    return {
      event: {},
      isAdmin: false,
      isEditing: false,
      editedEvent: {}
    };
  },
  created() {
    this.fetchEventDetails();
    this.checkAdminStatus();
  },
  methods: {
    async fetchEventDetails() {
      try {
        const eventId = this.$route.params.id;
        const { data, error } = await supabase.from('events').select('*').eq('id', eventId).single();
        if (error || !data) {
          throw new Error('Event not found');
        }
        this.event = data;
      } catch (error) {
        console.error('Event not found', error);
        toast.error("Event not found", {
          theme: "dark",
          position: "top-center"
        });
      }
    },
    async checkAdminStatus() {
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data, error } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
          this.isAdmin = data && data.role === 'admin';
        } else {
          this.isAdmin = false;
        }
      });
    },
    toggleEdit() {
      if (!this.isEditing) {
        this.editedEvent = { ...this.event };
      }
      this.isEditing = !this.isEditing;
    },
    async saveChanges() {
      try {
        const eventId = this.$route.params.id;
        if (!this.editedEvent.eventName || !this.editedEvent.clubName) {
          throw new Error("Event name and club name are required");
        }
        const { error } = await supabase.from('events').update(this.editedEvent).eq('id', eventId);
        if (error) throw error;
        this.event = { ...this.editedEvent };
        this.isEditing = false;
        toast.success("Event updated successfully", {
          theme: "dark",
          position: "top-center"
        });
      } catch (error) {
        console.error('Error updating event:', error);
        toast.error(error.message || "Error updating event", {
          theme: "dark",
          position: "top-center"
        });
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

.collab-inputs, .contact-inputs {
  display: flex;
  gap: 10px;
  margin: 8px 0;
}

textarea {
  background-color: rgba(26, 26, 26, 0.9);
  color: #D4AF37;
  border: 1px solid #D4AF37;
  padding: 8px;
  border-radius: 4px;
  width: 100%;
  min-height: 100px;
  margin: 4px 0;
  font-family: inherit;
  resize: vertical;
}

input[type="text"],
input[type="number"],
input[type="tel"],
input[type="url"],
input[type="date"],
input[type="time"] {
  background-color: rgba(26, 26, 26, 0.9);
  color: #D4AF37;
  border: 1px solid #D4AF37;
  padding: 8px;
  border-radius: 4px;
  width: 100%;
  margin: 4px 0;
}

.edit-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: transparent;
  color: #D4AF37;
  border: 1px solid #D4AF37;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.3s;
}

.edit-btn:hover {
  background-color: #D4AF37;
  color: #1A1A1A;
}

.edit-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.save-btn {
  background-color: #D4AF37;
  color: #1A1A1A;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.3s;
}

.save-btn:hover {
  background-color: #E6D19D;
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