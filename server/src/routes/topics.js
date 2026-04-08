const express = require('express');
const router = express.Router();
const { getTopics } = require('../controllers/topicControllers');

router.get("/", getTopics);

module.exports = router;