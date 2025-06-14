const supabase = require('../config/supabase');

const checkRole = (allowedRoles = []) => async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch user role' });
    }

    if (!profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    if (!allowedRoles.includes(profile.role)) {
      return res.status(403).json({ error: `Only ${allowedRoles.join(' or ')} allowed` });
    }

    next();
  } catch (err) {
    console.error('🔥 Role middleware error:', err.message);
    res.status(500).json({ error: 'Role verification failed' });
  }
};

module.exports = checkRole;
