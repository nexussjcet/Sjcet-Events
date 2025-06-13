const supabase = require('../config/supabase');

const addOrganizer = async (req, res) => {
  try {
    const { email, name } = req.body;
    
    // First create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: generateTemporaryPassword(), // implement this function
      email_confirm: true,
    });
    
    if (authError) throw authError;

    // Add to profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        email,
        name,
        role: 'organizer'
      });
    
    if (profileError) throw profileError;

    // Add to organizers table
    const { data: organizerData, error: organizerError } = await supabase
      .from('organizers')
      .insert({
        email,
        name,
        created_by: req.user.id
      })
      .select();
    
    if (organizerError) throw organizerError;

    // Send invitation email (implement this)
    sendInvitationEmail(email, name);

    res.status(201).json(organizerData[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteOrganizer = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get organizer email first
    const { data: organizer, error: organizerError } = await supabase
      .from('organizers')
      .select('email')
      .eq('id', id)
      .single();
    
    if (organizerError) throw organizerError;
    if (!organizer) return res.status(404).json({ error: 'Organizer not found' });

    // Delete from auth users
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', organizer.email)
      .single();
    
    if (userError) throw userError;

    if (user) {
      const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(user.user_id);
      if (deleteAuthError) throw deleteAuthError;
    }

    // Delete from organizers table (profiles will be deleted via cascade)
    const { error: deleteError } = await supabase
      .from('organizers')
      .delete()
      .eq('id', id);
    
    if (deleteError) throw deleteError;

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addOrganizer, deleteOrganizer };
