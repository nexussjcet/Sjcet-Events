<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>Organizer Dashboard</h1>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </div>

    <div class="dashboard-stats">
      <div class="stat-card">
        <h3>My Events</h3>
        <p>{{ myEvents.length }}</p>
      </div>
      <div class="stat-card">
        <h3>Upcoming Events</h3>
        <p>{{ upcomingEvents.length }}</p>
      </div>
      <div class="stat-card">
        <h3>Total Registrations</h3>
        <p>{{ totalRegistrations }}</p>
      </div>
    </div>

    <div class="dashboard-actions">
      <button @click="navigateToRoute('AddEventForm')" class="action-btn">
        Create New Event
      </button>
      <button @click="navigateToRoute('DisplayEvents')" class="action-btn">
        View All Events
      </button>
    </div>

    <div class="my-events">
      <h2>My Events</h2>
      <div class="events-list">
        <div v-for="event in myEvents" :key="event.id" class="event-card">
          <h3>{{ event.title }}</h3>
          <p>{{ event.description }}</p>
          <div class="event-meta">
            <span>Date: {{ formatDate(event.date) }}</span>
            <span>Registrations: {{ event.registrations || 0 }}</span>
          </div>
          <div class="event-actions">
            <button @click="editEvent(event.id)" class="edit-btn">Edit</button>
            <button @click="viewRegistrations(event.id)" class="view-btn">View Registrations</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Registration Modal -->
    <div v-if="showRegistrations" class="modal">
      <div class="modal-content">
        <h2>Event Registrations</h2>
        <div class="registrations-list">
          <div v-for="registration in eventRegistrations" :key="registration.id" class="registration-card">
            <p><strong>Name:</strong> {{ registration.name }}</p>
            <p><strong>Email:</strong> {{ registration.email }}</p>
            <p><strong>Registered on:</strong> {{ formatDate(registration.created_at) }}</p>
          </div>
        </div>
        <button @click="showRegistrations = false" class="close-btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';
import { toast } from 'vue3-toastify';

export default {
  setup() {
    const router = useRouter();
    const myEvents = ref([]);
    const upcomingEvents = ref([]);
    const totalRegistrations = ref(0);
    const showRegistrations = ref(false);
    const eventRegistrations = ref([]);

    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // Fetch events created by the organizer
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .eq('organizer_id', user.id);
        
        if (eventsError) throw eventsError;
        
        myEvents.value = events;
        upcomingEvents.value = events.filter(event => new Date(event.date) > new Date());
        
        // Calculate total registrations
        totalRegistrations.value = events.reduce((total, event) => total + (event.registrations || 0), 0);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      }
    };

    const handleLogout = async () => {
      try {
        await supabase.auth.signOut();
        router.push('/');
        toast.success('Logged out successfully');
      } catch (error) {
        toast.error('Error logging out');
      }
    };

    const navigateToRoute = (routeName) => {
      router.push({ name: routeName });
    };

    const editEvent = (eventId) => {
      router.push({ name: 'EventDetails', params: { id: eventId } });
    };

    const viewRegistrations = async (eventId) => {
      try {
        const { data, error } = await supabase
          .from('registrations')
          .select('*')
          .eq('event_id', eventId);
        
        if (error) throw error;
        
        eventRegistrations.value = data;
        showRegistrations.value = true;
      } catch (error) {
        toast.error('Failed to load registrations');
      }
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString();
    };

    onMounted(() => {
      fetchDashboardData();
    });

    return {
      myEvents,
      upcomingEvents,
      totalRegistrations,
      showRegistrations,
      eventRegistrations,
      handleLogout,
      navigateToRoute,
      editEvent,
      viewRegistrations,
      formatDate
    };
  }
};
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  color: #666;
  margin-bottom: 0.5rem;
}

.stat-card p {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.dashboard-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.action-btn:hover {
  background: #45a049;
}

.my-events {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.events-list {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.event-card {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #4CAF50;
}

.event-meta {
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.event-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .view-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn {
  background: #2196F3;
  color: white;
}

.view-btn {
  background: #FF9800;
  color: white;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #d32f2f;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.registrations-list {
  margin: 1rem 0;
}

.registration-card {
  background: #f5f5f5;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
}

.close-btn {
  padding: 0.5rem 1rem;
  background: #666;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.close-btn:hover {
  background: #555;
}
</style> 