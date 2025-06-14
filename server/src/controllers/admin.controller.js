const supabase = require('../config/supabase');

// Temporary password generator
function generateTemporaryPassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

const addOrganizer = async (req, res) => {
  try {
    const { email, name } = req.body;
    const tempPassword = generateTemporaryPassword();

    // Step 1: Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    });
    if (authError) throw authError;

    const userId = authData.user.id;

    // Step 2: Upsert profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email,
        name,
        role: 'organizer',
      });

    if (profileError) throw profileError;

    // Step 3: Insert into organizers (avoid duplicate insert)
    const { data: existingOrg } = await supabase
      .from('organizers')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!existingOrg) {
      const { data: organizerData, error: organizerError } = await supabase
        .from('organizers')
        .insert({
          name,
          email,
          user_id: userId,
        })
        .select();

      if (organizerError) throw organizerError;

      // Step 4: Log invitation
      console.log(`✅ Organizer created. Temp password for ${email}: ${tempPassword}`);

      return res.status(201).json({
        ...organizerData[0],
        temp_password: tempPassword,
      });
    } else {
      return res.status(200).json({
        message: 'Organizer already exists',
        email,
      });
    }

  } catch (err) {
    console.error('❌ Add Organizer Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
const deleteOrganizer = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the organizer
    const { data: organizer, error: fetchError } = await supabase
      .from('organizers')
      .select('user_id, email')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;
    if (!organizer) return res.status(404).json({ error: 'Organizer not found' });

    // Delete from Supabase Auth
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(organizer.user_id);
    if (deleteAuthError) throw deleteAuthError;

    // Delete from organizers table (profiles will be removed if cascade is set)
    const { error: deleteOrgError } = await supabase
      .from('organizers')
      .delete()
      .eq('id', id);

    if (deleteOrgError) throw deleteOrgError;

    res.status(200).json({ message: 'Organizer deleted successfully' });

  } catch (err) {
    console.error('❌ Delete Organizer Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addOrganizer,
  deleteOrganizer,
};
