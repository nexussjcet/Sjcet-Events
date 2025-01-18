<template>
  <div class="request-container background-image">
    <button class="back-btn" @click="$router.push({ name: 'DisplayEvents' })">
      <i class="pi pi-arrow-left"></i> Back
    </button>
    
    <div class="form-container" data-aos="fade-up" data-aos-duration="1500">
      <h1>Request New Event</h1>
      
      <form @submit.prevent="submitRequest" class="request-form">
        <div class="form-section">
          <h2>Event Details</h2>
          <div class="form-group">
            <label>Your Name *</label>
            <input 
              v-model="requestData.requesterName" 
              type="text" 
              required
            />
          </div>
          
          <div class="form-group">
            <label>Your Email *</label>
            <input 
              v-model="requestData.requesterEmail" 
              type="email" 
              required
            />
          </div>

          <div class="form-group">
            <label>Event Name *</label>
            <input 
              v-model="requestData.eventName" 
              type="text" 
              required
            />
          </div>

          <div class="form-group">
            <label>Organizing Club/Department *</label>
            <input 
              v-model="requestData.clubName" 
              type="text" 
              required
            />
          </div>

          <div class="form-group">
            <label>Event Description *</label>
            <textarea 
              v-model="requestData.eventDesc" 
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label>Mode of Conduction *</label>
            <select v-model="requestData.mode" @change="checkMode" required>
              <option value="" disabled>Select Mode</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <div class="datetime-group">
            <div class="form-group">
              <label>Event Date *</label>
              <div class="datetime-picker" :class="{ 'error': dateError }">
                <input 
                  v-model="requestData.date" 
                  type="date" 
                  required
                  :min="minDate"
                  :max="maxDate"
                  class="date-input"
                  @change="validateDates"
                />
                <svg class="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span class="error-message" v-if="dateError">{{ dateError }}</span>
              </div>
            </div>

            <div class="form-group">
              <label>Event Time *</label>
              <div class="datetime-picker">
                <input 
                  v-model="requestData.time" 
                  type="time" 
                  required
                  class="time-input"
                />
                <svg class="clock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Registration Last Date *</label>
            <div class="datetime-picker" :class="{ 'error': regDateError }">
              <input 
                v-model="requestData.regLastDate" 
                type="date" 
                required
                :min="minDate"
                :max="requestData.date"
                class="date-input"
                @change="validateDates"
              />
              <svg class="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span class="error-message" v-if="regDateError">{{ regDateError }}</span>
            </div>
          </div>

          <div class="form-group">
            <label>Venue/Platform {{ requestData.mode === 'Offline' ? '*' : '' }}</label>
            <input 
              v-model="requestData.venue" 
              type="text" 
              :required="requestData.mode === 'Offline'"
            />
          </div>

          <div class="form-group">
            <label>Expected Number of Participants *</label>
            <input 
              v-model="requestData.expectedParticipants" 
              type="number" 
              required
            />
          </div>

          <div class="form-group">
            <label>Registration Fee (if any)</label>
            <input 
              v-model="requestData.regFee" 
              type="number"
              placeholder="0 if free"
            />
          </div>

          <div class="form-group">
            <label>Certificates Provided? *</label>
            <select v-model="requestData.certificates" required>
              <option value="" disabled>Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div class="form-group">
            <label>Additional Details</label>
            <textarea 
              v-model="requestData.additionalDetails"
              placeholder="Any other important information..."
            ></textarea>
          </div>

          <div class="form-group">
            <label>Event Poster *</label>
            <div class="poster-upload">
              <input 
                type="file" 
                @change="handleImageUpload" 
                accept="image/*"
                required
                ref="fileInput"
                class="file-input"
              />
              <div class="preview-container" v-if="imagePreview">
                <img :src="imagePreview" alt="Preview" class="image-preview"/>
                <button type="button" @click="removeImage" class="remove-btn">×</button>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" class="submit-btn">Submit Request</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { db, auth, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from "vue3-toastify";

export default {
  setup() {
    const requestData = ref({
      requesterName: '',
      requesterEmail: '',
      eventName: '',
      clubName: '',
      eventDesc: '',
      mode: '',
      date: '',
      time: '',
      venue: '',
      expectedParticipants: '',
      regFee: 0,
      certificates: '',
      additionalDetails: '',
      status: 'pending',
      requestedAt: new Date(),
      requesterId: auth.currentUser?.uid,
      posterURL: '',
      regLastDate: '',
    });
    
    const imageFile = ref(null);
    const imagePreview = ref(null);
    const fileInput = ref(null);

    const dateError = ref('');
    const regDateError = ref('');

    // Get current date
    const today = new Date();
    const minDate = ref(today.toISOString().split('T')[0]);
    
    // Set maximum date to 2 years from now
    const maxDate = ref(new Date(today.getFullYear() + 2, today.getMonth(), today.getDate()).toISOString().split('T')[0]);

    const checkMode = () => {
      if (requestData.value.mode === 'Online') {
        requestData.value.venue = '';
      }
    };

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        imageFile.value = file;
        const reader = new FileReader();
        reader.onload = e => {
          imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const removeImage = () => {
      imageFile.value = null;
      imagePreview.value = null;
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };

    const validateDates = () => {
      dateError.value = '';
      regDateError.value = '';

      const eventDate = new Date(requestData.value.date);
      const regDate = new Date(requestData.value.regLastDate);
      const today = new Date();

      // Reset time part for accurate date comparison
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
      regDate.setHours(0, 0, 0, 0);

      // Validate event date
      if (eventDate < today) {
        dateError.value = 'Event date cannot be in the past';
        return false;
      }

      // Check if date is too far in the future
      const maxAllowedDate = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());
      if (eventDate > maxAllowedDate) {
        dateError.value = 'Event date cannot be more than 2 years in the future';
        return false;
      }

      // Validate registration date
      if (requestData.value.regLastDate) {
        if (regDate > eventDate) {
          regDateError.value = 'Registration end date must be before event date';
          return false;
        }
        if (regDate < today) {
          regDateError.value = 'Registration end date cannot be in the past';
          return false;
        }
      }

      return true;
    };

    const submitRequest = async () => {
      try {
        if (!validateDates()) {
          toast.error("Please fix the date errors before submitting", {
            theme: "dark",
            position: "top-center"
          });
          return;
        }

        let posterURL = '';
        
        if (imageFile.value) {
          console.log('Uploading image...');
          const imageRef = storageRef(storage, `event-posters/${Date.now()}-${imageFile.value.name}`);
          await uploadBytes(imageRef, imageFile.value);
          posterURL = await getDownloadURL(imageRef);
          console.log('Image uploaded, URL:', posterURL);
        }

        console.log('Submitting request with data:', { ...requestData.value, posterURL });

        await addDoc(collection(db, 'eventRequests'), {
          ...requestData.value,
          posterURL,
          requestedAt: new Date(),
          requesterId: auth.currentUser?.uid
        });
        
        toast.success("Event request submitted successfully!", {
          theme: "dark",
          position: "top-center"
        });
        
        router.push({ name: 'DisplayEvents' });
      } catch (error) {
        console.error('Error details:', error);
        toast.error("Error submitting request. Please try again.", {
          theme: "dark",
          position: "top-center"
        });
      }
    };

    return {
      requestData,
      submitRequest,
      checkMode,
      handleImageUpload,
      removeImage,
      imagePreview,
      fileInput,
      minDate,
      dateError,
      regDateError,
      maxDate,
      validateDates,
    };
  }
};
</script>

<style scoped>
.background-image {
  background-image: url('/bg1invert.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  padding: 2rem;
}

.request-container {
  position: relative;
  color: #BABABA;
}

.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background: transparent;
  border: none;
  color: #D4AF37;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-container {
  max-width: 800px;
  margin: 2rem auto;
  background: rgba(26, 26, 26, 0.95);
  padding: 2rem;
  border-radius: 12px;
  border: 2px solid #D4AF37;
}

.form-container h1 {
  color: #D4AF37;
  text-align: center;
  margin-bottom: 2rem;
}

.form-section h2 {
  color: #D4AF37;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #BABABA;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #D4AF37;
  border-radius: 4px;
  color: #BABABA;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: transparent;
  border: 2px solid #D4AF37;
  color: #D4AF37;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.submit-btn:hover {
  background: #D4AF37;
  color: #1A1A1A;
}

@media (max-width: 768px) {
  .form-container {
    margin: 1rem;
    padding: 1rem;
  }
  
  .back-btn {
    top: 10px;
    left: 10px;
  }
}

.poster-upload {
  border: 2px dashed #D4AF37;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.file-input {
  width: 100%;
  padding: 0.5rem;
  color: #BABABA;
}

.preview-container {
  position: relative;
  margin-top: 1rem;
  display: inline-block;
}

.image-preview {
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
}

.remove-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.remove-btn:hover {
  background: #ff0000;
}

.datetime-picker {
  position: relative;
  display: flex;
  align-items: center;
}

.date-input,
.time-input {
  width: 100%;
  padding: 0.75rem;
  padding-right: 2.5rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #D4AF37;
  border-radius: 4px;
  color: #BABABA;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
}

.date-input::-webkit-calendar-picker-indicator,
.time-input::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.calendar-icon,
.clock-icon {
  position: absolute;
  right: 10px;
  width: 20px;
  height: 20px;
  pointer-events: none;
  stroke: #D4AF37;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.datetime-picker:hover .calendar-icon,
.datetime-picker:hover .clock-icon {
  opacity: 1;
  stroke-width: 2;
  filter: drop-shadow(0 0 2px rgba(212, 175, 55, 0.3));
}

/* Style focus states */
.date-input:focus,
.time-input:focus {
  outline: none;
  border-color: #D4AF37;
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
}

/* Hover effects */
.datetime-picker:hover .date-input,
.datetime-picker:hover .time-input {
  border-color: #D4AF37;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.1);
}

/* Style the calendar dropdown (works in most modern browsers) */
::-webkit-calendar-picker-indicator {
  background: transparent;
  cursor: pointer;
}

/* For better mobile support */
@media (max-width: 768px) {
  .date-input,
  .time-input {
    font-size: 16px; /* Prevents zoom on mobile */
  }
}

/* Add animation for icon */
@keyframes subtle-bounce {
  0% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0); }
}

.datetime-picker:hover .calendar-icon,
.datetime-picker:hover .clock-icon {
  animation: subtle-bounce 0.3s ease;
}

.datetime-picker.error .date-input {
  border-color: #ff4444;
  box-shadow: 0 0 0 1px #ff4444;
}

.datetime-picker.error .calendar-icon {
  stroke: #ff4444;
}

.error-message {
  position: absolute;
  top: 100%;
  left: 0;
  color: #ff4444;
  font-size: 0.8rem;
  margin-top: 4px;
  background-color: rgba(255, 68, 68, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
}

/* Add spacing for error messages */
.form-group {
  margin-bottom: 2rem;
}

/* Improve focus state for error cases */
.datetime-picker.error .date-input:focus {
  border-color: #ff4444;
  box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.2);
}

.datetime-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .datetime-group {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style> 