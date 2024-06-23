
<script>
import { db } from "../firebase"; 
import { addDoc,collection } from "firebase/firestore";
import { toast } from "vue3-toastify";

import "vue3-toastify/dist/index.css";


export default {
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
      }
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const docRef = await addDoc(collection(db, 'events'), this.eventDetail);
        console.log('Document written with ID: ', docRef.id);
        this.notify();
      } catch (error) {
        console.error('Error adding document: ', error);
        this.handleError();
      }
    },
    notify() {
      toast("Successfully added event", {
        "theme": "dark",
        "type": "success",
        "position": "top-center",
        "dangerouslyHTMLString": true
      });
    },
    handleError() {
      toast("Error adding event", {
        "theme": "dark",
        "type": "error",
        "position": "top-center",
        "dangerouslyHTMLString": true
      });
    }
  },
};
</script>

<template>
    <div class="home-container">
    <h1 class="add-event" data-aos="fade-down" data-aos-duration="1500">ADD A NEW EVENT</h1>
    <form data-aos="fade-up" data-aos-duration="1500" @submit.prevent="handleSubmit">
    <FormKit type="form" :actions="false">
    <FormKit
      type="button"
      label="Home"
      @click= "$router.push({ name: 'Home' })"

    />
    <h2>Fill the following details to add an event</h2>
    <FormKit type="multi-step" tab-style="progress"  :allow-incomplete="false">
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
    <h2>Next,Tell us about the speaker/mentor.</h2>
      <FormKit 
        type="text" 
        label="Speker/Mentor Name (Optional)"
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
        <FormKit type="submit"  v-on:click="handleSubmit" @click="$router.push({ name: 'DisplayEvents' })"/>
      </template>
  </FormKit>
  </FormKit>
</FormKit>
</form>
</div>
</template>

<style>
.add-event {
  color: #333;
  text-align: center;
  font-size: 2.5rem;
  margin-top: 1.5em;
}
form {
  box-sizing: border-box;
  background: white;
  padding: 1.0em;
  width: 40em;
  margin: 0 auto;
  max-width: calc(100% - 4.5em);
  border-radius: 0.5em;
}
@media (max-width: 768px) {
  form {
    width: 100%;
    max-width: none;
  }
}
</style>
