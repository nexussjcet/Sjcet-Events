const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');
const { addOrganizer, deleteOrganizer } = require('../controllers/admin.controller');

router.use(authenticate);
router.use(checkRole('admin'));

router.post('/organizers', addOrganizer);
router.delete('/organizers/:id', deleteOrganizer);

module.exports = router;
