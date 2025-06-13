const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getEventDetails
} = require('../controllers/event.controller');

// GET /api/event/all
router.get('/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// POST /api/event/register
router.post('/register', async (req, res) => {
  const { event_id, attendee_name, email } = req.body;

  if (!event_id || !attendee_name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{ event_id, attendee_name, email }]);

    if (error) throw error;

    res.status(201).json({ message: 'Registered successfully', data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register' });
  }
});

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventDetails);

// Protected routes
router.use(authenticate);
router.use(checkRole('organizer'));

router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
