<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>Admin Dashboard</h1>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </div>

    <div class="dashboard-stats">
      <div class="stat-card">
        <h3>Total Events</h3>
        <p>{{ totalEvents }}</p>
      </div>
      <div class="stat-card">
        <h3>Total Users</h3>
        <p>{{ totalUsers }}</p>
      </div>
      <div class="stat-card">
        <h3>Active Events</h3>
        <p>{{ activeEvents }}</p>
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

    <div class="recent-events">
      <h2>Recent Events</h2>
      <div class="events-list">
        <div v-for="event in recentEvents" :key="event.id" class="event-card">
          <h3>{{ event.title }}</h3>
          <p>{{ event.description }}</p>
          <div class="event-meta">
            <span>Date: {{ formatDate(event.date) }}</span>
            <span>Organizer: {{ event.organizer }}</span>
          </div>
          <div class="event-actions">
            <button @click="editEvent(event.id)" class="edit-btn">Edit</button>
            <button @click="deleteEvent(event.id)" class="delete-btn">Delete</button>
          </div>
        </div>
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
    const totalEvents = ref(0);
    const totalUsers = ref(0);
    const activeEvents = ref(0);
    const recentEvents = ref([]);

    const fetchDashboardData = async () => {
      try {
        // Fetch total events
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('*');
        
        if (eventsError) throw eventsError;
        
        totalEvents.value = events.length;
        activeEvents.value = events.filter(event => new Date(event.date) > new Date()).length;
        recentEvents.value = events.slice(0, 5); // Get 5 most recent events

        // Fetch total users
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('*');
        
        if (usersError) throw usersError;
        totalUsers.value = users.length;

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

    const deleteEvent = async (eventId) => {
      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', eventId);
        
        if (error) throw error;
        
        toast.success('Event deleted successfully');
        fetchDashboardData(); // Refresh the data
      } catch (error) {
        toast.error('Failed to delete event');
      }
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString();
    };

    onMounted(() => {
      fetchDashboardData();
    });

    return {
      totalEvents,
      totalUsers,
      activeEvents,
      recentEvents,
      handleLogout,
      navigateToRoute,
      editEvent,
      deleteEvent,
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

.recent-events {
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

.edit-btn, .delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn {
  background: #2196F3;
  color: white;
}

.delete-btn {
  background: #f44336;
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
</style> 