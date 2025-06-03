const router = require('express').Router();
const ticketController = require('../controllers/ticketController');
const AuditLog = require('../models/AuditLog'); 
const authMiddleware = require('../middleware/authMiddleware');

// Route for getting a list of all tickets
router.get('/', authMiddleware(['user', 'agent', 'admin']), ticketController.getTickets);

// Route for creating a new ticket
router.post('/', authMiddleware(['user', 'agent', 'admin']), ticketController.createTicket);


router.get('/:id', authMiddleware(['user', 'agent', 'admin']), ticketController.getTicketById); 

router.post('/:id/reply', authMiddleware(['agent', 'admin']), ticketController.addReply);

router.get('/:id/audit', authMiddleware(['user', 'agent', 'admin']), async (req, res) => {
    try {
        const logs = await AuditLog.find({ ticketId: req.params.id }).sort({ timestamp: 1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router;