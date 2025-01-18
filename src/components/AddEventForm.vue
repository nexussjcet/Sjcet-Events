<template>
  <div class="home-container background-image">
    <div v-if="submissionStatus" :class="['status-message', submissionStatus.type]">
      {{ submissionStatus.message }}
    </div>
    <h1 class="add-event" data-aos="fade-down" data-aos-duration="1500">ADD A NEW EVENT</h1>
    <form data-aos="fade-up" data-aos-duration="1500" @submit.prevent="handleSubmit">
      <FormKit type="form" :actions="false">
        <FormKit
          type="button"
          label="Home"
          @click="navigateTo('Home')"
        />
        <h2>Fill the following details to add an event</h2>
        <FormKit type="multi-step" tab-style="progress" :allow-incomplete="false">
          <FormKit type="step" name="Event Details">
            <h2>Please begin with the event details</h2>
            <FormKit 
              type="text" 
              label="Organizing Club" 
              validation="required"
              placeholder="Enter Name of your club"
              v-model="eventDetail.clubName"
            />
            <FormKit 
              type="text" 
              label="Event Name" 
              validation="required"
              placeholder="Enter Name of Event"
              v-model="eventDetail.eventName"
            />
            <FormKit 
              type="date" 
              label="Date" 
              validation="required" 
              v-model="eventDetail.date"
            />
            <FormKit 
              type="select" 
              label="Mode of Conduct"
              placeholder="Select"
              :options="['Online','Offline']"
              validation="required"
              v-model="eventDetail.mode"
            />
            <FormKit 
              type="time"
              label="Time"
              placeholder="00:00" 
              validation="required" 
              help="Enter Time in 24 hours format"
              v-model="eventDetail.time"
            />
            <FormKit 
              type="text" 
              label="Venue/Platform" 
              validation="required"
              placeholder="Enter the Venue"
              v-model="eventDetail.venue"
            />
          </FormKit>

          <FormKit type="step" name="Registration Details">
            <h2>Please fill out the registration details</h2>
            <FormKit 
              type="text" 
              label="Registration Fee"
              placeholder="Enter registration fee"
              validation="required"
              help="Enter 0, if the event is free of cost"
              v-model="eventDetail.regFee"
            />
            <FormKit
              type="url"
              label="Registration Link"
              placeholder="https://www.example.com..."
              validation="required|url"
              v-model="eventDetail.regLink"
            />
            <FormKit 
              type="radio" 
              label="Issue of certificates"
              :options="['Yes', 'No']"
              validation="required"
              v-model="eventDetail.certificates"
            />
            <FormKit 
              type="date" 
              label="Last Date to register" 
              validation="required"
              v-model="eventDetail.regLastDate"
            />
          </FormKit>

          <FormKit type="step" name="Speaker Details">
            <h2>Next, Tell us about the speaker/mentor.</h2>
            <FormKit 
              type="text" 
              label="Speaker/Mentor Name (Optional)"
              placeholder="Enter the speaker's/mentor's name"
              v-model="eventDetail.mentor"
            />
            <FormKit
              type="textarea"
              label="About the speaker/mentor(Optional)"
              placeholder="Write a short description about the speaker"
              v-model="eventDetail.aboutMentor"
            />
            <FormKit 
              type="textarea" 
              label="In collaboration with (Optional)"
              placeholder="Write about collaborators"
              v-model="eventDetail.collab"
            />
          </FormKit>

          <FormKit type="step" name="Contact Details">
            <h2>Thank you for taking the time to submit your event</h2>
            <p>Now we require your contact details too.</p>
            <FormKit 
              type="textarea" 
              label="Event Description (Optional)" 
              placeholder="Enter a short description of the event"
              v-model="eventDetail.eventDesc"
            />
            <FormKit 
              type="text" 
              label="Name of Organizer" 
              validation="required"
              placeholder="Enter your name"
              v-model="eventDetail.organizerName"
            />
            <FormKit
              type="tel"
              label="Phone number"
              placeholder="xxxxxxxxxx"
              validation="matches:/^[0-9]{10}$/"
              :validation-messages="{
                matches: 'Phone number must be 10 digits long',
              }"
              validation-visibility="dirty"
              v-model="eventDetail.phone"
            />
            
            <template #stepNext>
              <FormKit 
                type="submit" 
                :disabled="isSubmitting"
                @click="submitAndNavigate"
              >
                {{ isSubmitting ? 'Submitting...' : 'Submit' }}
              </FormKit>
            </template>
          </FormKit>
        </FormKit>
      </FormKit>
    </form>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { db } from "../firebase"; 
import { addDoc, collection } from "firebase/firestore";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  setup() {
    const router = useRouter();

    const navigateTo = (routeName) => {
      router.push({ name: routeName });
    };
    
    return {
      navigateTo,
    };
  },
  
  data() {
    return {
      eventDetail: {
        clubName: '',
        eventName: '',
        date: '',
        mode: '',
        time: '',
        venue: '',
        regFee: '',
        certificates: '',
        regLink: '',
        regLastDate: '',
        furthDetails: '',
        mentor: '',
        aboutMentor: '',
        collab: '',
        eventDesc: '',
        organizerName: '',
        phone: ''
      },
      isSubmitting: false,
      submissionStatus: null
    };
  },

  methods: {
    async handleSubmit() {
      if (this.isSubmitting) return false;
      
      this.isSubmitting = true;
      this.submissionStatus = null;
      
      try {
        const docRef = await addDoc(collection(db, 'events'), this.eventDetail);
        console.log('Document written with ID: ', docRef.id);
        this.submissionStatus = {
          type: 'success',
          message: 'Event submitted successfully!'
        };
        this.notify();
        return true;
      } catch (error) {
        console.error('Error adding document: ', error);
        this.submissionStatus = {
          type: 'error',
          message: 'Error submitting event. Please try again.'
        };
        this.handleError();
        return false;
      } finally {
        this.isSubmitting = false;
      }
    },

    async submitAndNavigate() {
      const success = await this.handleSubmit();
      if (success) {
        setTimeout(() => {
          this.navigateTo('DisplayEvents');
        }, 2000);
      }
    },

    notify() {
      toast("Successfully added event", {
        theme: "dark",
        type: "success",
        position: "top-center",
        dangerouslyHTMLString: true
      });
    },

    handleError() {
      toast("Error adding event", {
        theme: "dark",
        type: "error",
        position: "top-center",
        dangerouslyHTMLString: true
      });
    }
  },
};
</script>

<style scoped>
.background-image {
  background-image: url('/bg1invert.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  width: 100%;
  position: relative;
}

.home-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  padding: 2em 1em;
  position: relative;
  width: 100%;
  color: #f5f5dc;
  z-index: 1;
}

.home-container::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.8) 100%);
  z-index: -1;
}

.add-event {
  color: #b59d74;
  text-align: center;
  font-size: 2.5rem;
  margin: 1.5em 0;
  padding: 0 1em;
  width: 100%;
  max-width: 800px;
}

form {
  background: rgba(51, 51, 51, 0.85);
  color: #f5f5dc;
  padding: 2em;
  width: 100%;
  max-width: 40em;
  margin: 0 auto 2em;
  border-radius: 0.5em;
  border: 1px solid #b59d74;
}

/* FormKit Reset and Base Styles */
:deep(.formkit-input) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #b59d74 !important;
  color: #f5f5dc;
  padding: 0.75em;
  border-radius: 0.25em;
  width: 100%;
  outline: none !important;
  box-shadow: none !important;
}

:deep(.formkit-input:focus) {
  border-color: #d4b995 !important;
  box-shadow: 0 0 0 2px rgba(181, 157, 116, 0.3) !important;
}

/* Remove default FormKit styling */
:deep(.formkit-outer) {
  margin-bottom: 1.5em;
}

:deep(.formkit-wrapper) {
  border: none !important;
  box-shadow: none !important;
}

/* Step Styles */
:deep(.formkit-step) {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.5em;
  padding: 1.5em;
  margin-bottom: 2em;
}

:deep(.formkit-step h2) {
  color: #b59d74;
  font-size: 1.25rem;
  margin-bottom: 1.5em;
  text-align: center;
}

/* Progress Bar Styles */
:deep(.formkit-step-progress) {
  margin: 0 0 2em 0;
  padding: 1em;
  border-bottom: 1px solid rgba(181, 157, 116, 0.3);
}

:deep(.formkit-step-progress-item) {
  color: #b59d74;
  padding: 0.5em 1em;
  border-radius: 0.25em;
}

:deep(.formkit-step-progress-item.is-active) {
  background: rgba(181, 157, 116, 0.2);
}

/* Form Elements */
:deep(.formkit-label) {
  color: #f5f5dc;
  margin-bottom: 0.5em;
  font-weight: 500;
}

:deep(.formkit-help) {
  color: #b59d74;
  font-size: 0.875em;
  margin-top: 0.25em;
}

:deep(.formkit-messages) {
  color: #ff6b6b;
  font-size: 0.875em;
  margin-top: 0.25em;
}

/* Button Styles */
:deep(.formkit-input[type="submit"]),
:deep(.formkit-input[type="button"]) {
  background: #b59d74;
  color: #1a1a1a;
  border: none !important;
  padding: 0.75em 1.5em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

:deep(.formkit-input[type="submit"]:hover),
:deep(.formkit-input[type="button"]:hover) {
  background: #d4b995;
}

/* Mobile Styles */
@media (max-width: 768px) {
  form {
    padding: 1em;
  }

  :deep(.formkit-step) {
    padding: 1em;
    margin-bottom: 1.5em;
  }

  :deep(.formkit-step-progress) {
    overflow-x: auto;
    white-space: nowrap;
    padding: 0.75em;
    margin-bottom: 1.5em;
    -webkit-overflow-scrolling: touch;
  }

  :deep(.formkit-step-progress-item) {
    font-size: 0.9rem;
    padding: 0.5em 0.75em;
  }
}

@media (max-width: 480px) {
  .add-event {
    font-size: 1.8rem;
    margin: 1em 0;
  }

  form {
    padding: 0.75em;
  }

  :deep(.formkit-step) {
    padding: 0.75em;
    margin-bottom: 1em;
  }

  :deep(.formkit-step h2) {
    font-size: 1rem;
    margin-bottom: 1em;
  }

  :deep(.formkit-outer) {
    margin-bottom: 1em;
  }

  :deep(.formkit-input) {
    padding: 0.5em;
    font-size: 0.9rem;
  }

  :deep(.formkit-label) {
    font-size: 0.9rem;
  }

  :deep(.formkit-step-progress) {
    padding: 0.5em;
    margin-bottom: 1em;
  }

  :deep(.formkit-step-progress-item) {
    font-size: 0.8rem;
    padding: 0.4em 0.6em;
  }
}

/* Status Message Styles */
.status-message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1em;
  border-radius: 4px;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  color: #f5f5dc;
  font-weight: bold;
  max-width: 90%;
}

.status-message.success {
  background-color: #6e8b3d;
  border: 1px solid #b59d74;
}

.status-message.error {
  background-color: #8b3a3a;
  border: 1px solid #b59d74;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

</style>