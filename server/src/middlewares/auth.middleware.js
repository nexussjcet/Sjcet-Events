const supabase = require('../config/supabase');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log("❌ No token");
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      console.log("❌ Invalid token:", error);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const user = data.user;
    console.log("✅ User ID:", user.id);

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.log("❌ Profile fetch error:", profileError);
      return res.status(403).json({ error: 'Role verification failed' });
    }

    console.log("✅ Profile Data:", profileData);

    req.user = {
      id: user.id,
      email: user.email,
      role: profileData?.role || 'student',
    };

    next();
  } catch (err) {
    console.error('🔥 Authentication Error:', err.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

module.exports = authenticate;

