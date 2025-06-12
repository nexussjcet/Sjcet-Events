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
