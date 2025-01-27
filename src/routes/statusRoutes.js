const express = require('express');
const statusController = require('../controllers/statusController');

const router = express.Router();

// Status Route
router.get('/', statusController.getStatus);

module.exports = router;
