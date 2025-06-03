const { v4: uuidv4 } = require('uuid');
const AuditLog = require('../models/AuditLog');
const Ticket = require('../models/Ticket');
const AgentSuggestion = require('../models/AgentSuggestion');
const Config = require('../models/Config');
const { classify, retrieveKB, draftReply } = require('./llmProvider');

let triageQueue = [];
let isProcessing = false;

async function processQueue() {
  if (isProcessing || triageQueue.length === 0) return;

  isProcessing = true;
  const { ticketId, traceId } = triageQueue.shift();

  try {
    console.log(`Starting triage for ticket ${ticketId}`);
    await triageTicket(ticketId, traceId);
  } catch (error) {
    console.error(`Triage failed for ticket ${ticketId}:`, error);
  } finally {
    isProcessing = false;
    processQueue();
  }
}

async function triageTicket(ticketId, traceId) {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return;

  await AuditLog.create({ ticketId, traceId, actor: 'system', action: 'AGENT_TRIAGE_STARTED' });

  // 1. Classify
  const classificationResult = await classify(ticket.description);
  await AuditLog.create({
    ticketId,
    traceId,
    actor: 'system',
    action: 'TICKET_CLASSIFIED',
    meta: { predictedCategory: classificationResult.predictedCategory, confidence: classificationResult.confidence }
  });

  // 2. Retrieve KB Articles
  const kbArticles = await retrieveKB(ticket.description);
  await AuditLog.create({
    ticketId,
    traceId,
    actor: 'system',
    action: 'KB_RETRIEVED',
    meta: { articleIds: kbArticles.map(a => a._id) }
  });

  // 3. Draft Reply
  const draftResult = await draftReply(ticket.description, kbArticles);
  await AuditLog.create({
    ticketId,
    traceId,
    actor: 'system',
    action: 'DRAFT_GENERATED',
    meta: { draftReply: draftResult.draftReply, citations: draftResult.citations }
  });

  // 4. Decision
  const config = await Config.findOne({});
  const autoCloseEnabled = config?.autoCloseEnabled ?? true;
  const confidenceThreshold = config?.confidenceThreshold ?? 0.8;

  const autoClosed = autoCloseEnabled && classificationResult.confidence >= confidenceThreshold;

  const suggestion = await AgentSuggestion.create({
    ticketId,
    predictedCategory: classificationResult.predictedCategory,
    articleIds: kbArticles.map(a => a._id),
    draftReply: draftResult.draftReply,
    confidence: classificationResult.confidence,
    autoClosed,
    modelInfo: classificationResult.modelInfo
  });

  if (autoClosed) {
    ticket.status = 'resolved';
    ticket.agentSuggestionId = suggestion._id;
    await AuditLog.create({
      ticketId,
      traceId,
      actor: 'system',
      action: 'AUTO_CLOSED',
      meta: { autoClosed: true, confidence: classificationResult.confidence }
    });
  } else {
    ticket.status = 'waiting_human';
    ticket.agentSuggestionId = suggestion._id;
    await AuditLog.create({
      ticketId,
      traceId,
      actor: 'system',
      action: 'ASSIGNED_TO_HUMAN',
      meta: { autoClosed: false, confidence: classificationResult.confidence }
    });
  }

  await ticket.save();
  console.log(`Triage complete for ticket ${ticketId}. New status: ${ticket.status}`);
}

module.exports = {
  enqueueTriage: (ticketId) => {
    const traceId = uuidv4();
    triageQueue.push({ ticketId, traceId });
    processQueue();
  }
};