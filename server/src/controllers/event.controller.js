
const supabase = require('../config/supabase');

const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, image_url, website_url } = req.body;
    
    // Verify the user is an organizer
    const { data: organizer, error: organizerError } = await supabase
      .from('organizers')
      .select('id')
      .eq('email', req.user.email)
      .single();
    
    if (organizerError) throw organizerError;
    if (!organizer) return res.status(403).json({ error: 'Only organizers can create events' });

    const { data, error } = await supabase
      .from('events')
      .insert({
        title,
        description,
        date,
        time,
        location,
        image_url,
        website_url,
        organizer_id: organizer.id
      })
      .select();
    
    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verify the user is the organizer who created this event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('organizer_id')
      .eq('id', id)
      .single();
    
    if (eventError) throw eventError;
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const { data: organizer, error: organizerError } = await supabase
      .from('organizers')
      .select('id')
      .eq('email', req.user.email)
      .single();
    
    if (organizerError) throw organizerError;
    if (organizer.id !== event.organizer_id) {
      return res.status(403).json({ error: 'You can only update your own events' });
    }

    const { data, error } = await supabase
      .from('events')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;

    res.status(200).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify the user is the organizer who created this event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('organizer_id')
      .eq('id', id)
      .single();
    
    if (eventError) throw eventError;
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const { data: organizer, error: organizerError } = await supabase
      .from('organizers')
      .select('id')
      .eq('email', req.user.email)
      .single();
    
    if (organizerError) throw organizerError;
    if (organizer.id !== event.organizer_id) {
      return res.status(403).json({ error: 'You can only delete your own events' });
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) throw error;

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*, organizers(name)')
      .order('date', { ascending: true });
    
    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEventDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('events')
      .select('*, organizers(name, email)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Event not found' });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getEventDetails
};
