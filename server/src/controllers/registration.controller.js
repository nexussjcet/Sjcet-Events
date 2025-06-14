import supabase from '../config/supabase.js';

export const registerForEvent = async (req, res) => {
  try {
    const { event_id, name, email, phone } = req.body;

    if (!event_id || !name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Securely get the user ID from auth middleware
    const user_id = req.user.id;

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        event_id,
        user_id,
        attendee_name: name,
        email,
	phone
      })
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
