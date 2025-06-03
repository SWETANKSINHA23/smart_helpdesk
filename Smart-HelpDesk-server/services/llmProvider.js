const Article = require('../models/Article');
const STUB_MODE = process.env.STUB_MODE === 'true';

const classify = async (text) => {
  if (STUB_MODE) {
    const textLower = text.toLowerCase();
    let predictedCategory = 'other';
    let confidence = 0.0;
    
    if (textLower.includes('refund') || textLower.includes('invoice') || textLower.includes('charge')) {
      predictedCategory = 'billing';
      confidence = 0.9;
    } else if (textLower.includes('error') || textLower.includes('bug') || textLower.includes('login')) {
      predictedCategory = 'tech';
      confidence = 0.85;
    } else if (textLower.includes('shipment') || textLower.includes('delivery') || textLower.includes('track')) {
      predictedCategory = 'shipping';
      confidence = 0.95;
    }
    
    return { predictedCategory, confidence, modelInfo: { provider: 'Stub', model: 'v1.0', promptVersion: 'v1.0' } };
  }
};

const retrieveKB = async (text) => {
  const textTokens = text.toLowerCase().split(/\s+/);
  const relevantArticles = await Article.find({
    status: 'published',
    $or: [
      { tags: { $in: textTokens } },
      { title: { $regex: new RegExp(text, 'i') } },
      { body: { $regex: new RegExp(text, 'i') } }
    ]
  }).limit(3);
  
  return relevantArticles;
};

const draftReply = async (text, articles) => {
  if (STUB_MODE) {
    let reply = "Hello, thanks for reaching out. Based on your issue, here are some articles that might help:\n\n";
    articles.forEach((article, index) => {
      reply += `${index + 1}. **${article.title}**\n${article.body.substring(0, 150)}...\n\n`;
    });
    
    const citations = articles.map(a => a.title);
    return { draftReply: reply, citations };
  }
};

module.exports = { classify, retrieveKB, draftReply };