const supabase = require('../config/supabase');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const user = data.user;

    // Optional: Get user's role from `profiles` table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    // Attach info to request
    req.user = {
      id: user.id,
      email: user.email,
      role: profileData?.role || 'student',
    };

    next();
  } catch (err) {
    console.error('Authentication Error:', err.message);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = authenticate;
