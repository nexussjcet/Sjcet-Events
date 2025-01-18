<template>
  <transition :name="transitionName">
    <div class="home-container background-image" v-if="isVisible">
      <div v-if="submissionStatus" :class="['status-message', submissionStatus.type]">
        {{ submissionStatus.message }}
      </div>
      <h1 class="add-event" data-aos="fade-down" data-aos-duration="1500">ADD A NEW EVENT</h1>
      <form data-aos="fade-up" data-aos-duration="1500" @submit.prevent="handleSubmit">
        <FormKit type="form" :actions="false">
          <FormKit
            type="button"
            label="Home"
            @click="navigateWithTransition('Home')"
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
  </transition>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { db } from "../firebase"; 
import { addDoc, collection } from "firebase/firestore";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  setup() {
    const isVisible = ref(true);
    const transitionName = ref('slide-left');
    const router = useRouter();

    const navigateWithTransition = (routeName) => {
      if (routeName === 'Home') {
        transitionName.value = 'slide-left';
      } else {
        transitionName.value = 'slide-right';
      }
      isVisible.value = false;
      setTimeout(() => {
        router.push({ name: routeName });
      }, 500);
    };
    return {
      isVisible,
      transitionName,
      navigateWithTransition,
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
          this.navigateWithTransition('DisplayEvents');
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
  background-image: url('/bg1invert.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.home-container {
    display: flex;
    flex-direction: column;
    justify-content: center; 
    align-items: center;
    min-height: 100vh; 
    padding: 2em;
    text-align: left;
    position: absolute;
    width: 100%;
    color: #f5f5dc; 
}

.home-container::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.6), transparent);
  z-index: 0;
}

.add-event {
    color: #b59d74; 
    text-align: center;
    font-size: 2.5rem;
    margin-top: 1.5em;
}

form {
    box-sizing: border-box;
    background: rgba(51, 51, 51, 0.85); 
    color: #f5f5dc; 
    padding: 1.0em;
    width: 40em;
    margin: 0 auto;
    max-width: calc(100% - 4.5em);
    border-radius: 0.5em;
    margin-bottom: 2em;
    border: 1px solid #b59d74; 
}

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
    }
    to {
        transform: translateX(0);
    }
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 0.5s ease-in-out;
}

.slide-left-enter-from {
    transform: translateX(100%);
}

.slide-left-leave-to {
    transform: translateX(-100%);
}

.slide-right-enter-from {
    transform: translateX(-100%);
}

.slide-right-leave-to {
    transform: translateX(100%);
}

@media (max-width: 1024px) {
    form {
        width: 90%;
        max-width: none;
        padding: 1.5em;
    }

    .add-event {
        font-size: 2.2rem;
        margin-top: 1em;
    }

    .status-message {
        width: 85%;
        top: 15px;
        right: 7.5%;
        text-align: center;
    }
}

@media (max-width: 768px) {
    form {
        width: 100%;
        max-width: none;
        margin: 1em;
    }

    .add-event {
        font-size: 2rem;
        margin-top: 1em;
    }

    .status-message {
        width: 90%;
        top: 10px;
        right: 5%;
        text-align: center;
    }
}

@media (max-width: 480px) {
    form {
        width: 100%;
        max-width: none;
        padding: 1em;
        margin: 0.5em;
    }

    .add-event {
        font-size: 1.8rem;
        margin-top: 0.5em;
    }

    .status-message {
        width: 95%;
        top: 5px;
        right: 2.5%;
        font-size: 0.9rem;
        text-align: center;
    }
}
</style>
