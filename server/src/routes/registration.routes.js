const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/auth.middleware');
const { registerForEvent } = require('../controllers/registration.controller');

// POST /api/registrations/register
router.post('/register', authenticate, registerForEvent);

module.exports = router;
