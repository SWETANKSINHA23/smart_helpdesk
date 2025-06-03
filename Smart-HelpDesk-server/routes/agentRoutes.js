const router = require('express').Router();
const AgentSuggestion = require('../models/AgentSuggestion');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/suggestion/:ticketId', authMiddleware(['user', 'agent', 'admin']), async (req, res) => {
    try {
        const suggestion = await AgentSuggestion.findOne({ ticketId: req.params.ticketId }).sort({ createdAt: -1 });
        if (!suggestion) return res.status(404).json({ msg: 'No suggestion found for this ticket' });
        res.json(suggestion);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router;