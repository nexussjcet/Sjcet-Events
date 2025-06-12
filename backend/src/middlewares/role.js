const supabase = require('../config/supabase');

module.exports = (requiredRole) => async (req, res, next) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    if (!profile || profile.role !== requiredRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: 'Role verification failed' });
  }
};
