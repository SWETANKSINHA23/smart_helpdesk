const Ticket = require('../models/Ticket');
const AuditLog = require('../models/AuditLog');
const { enqueueTriage } = require('../services/agentService');

exports.createTicket = async (req, res) => {
  const { title, description } = req.body;
  const createdBy = req.user.id;
  try {
    const newTicket = new Ticket({ title, description, createdBy });
    const ticket = await newTicket.save();

    enqueueTriage(ticket._id);

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const filter = req.user.role === 'user' ? { createdBy: req.user.id } : {};
    const tickets = await Ticket.find(filter).populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('createdBy', 'name email');
    if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });

    if (req.user.role === 'user' && ticket.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.addReply = async (req, res) => {
  const { reply } = req.body;
  const ticketId = req.params.id;
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });
    
    ticket.status = 'resolved';
    await ticket.save();

    await AuditLog.create({
      ticketId,
      actor: 'agent',
      action: 'REPLY_SENT',
      meta: { reply },
      traceId: 'manual_reply'
    });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};