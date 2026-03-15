const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summary.controller');

router.post('/', summaryController.summarize);
router.get('/history', summaryController.getUserHistory);
router.delete('/:id', summaryController.deleteSummary);

module.exports = router;
