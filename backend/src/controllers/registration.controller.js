export const registerForEvent = async (req, res) => {
  try {
    const { event_id, name, email, phone } = req.body;
    
    const { data, error } = await supabase
      .from('registrations')
      .insert({
        event_id,
        user_id: req.user.id,
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
