const Article = require('../models/Article');

exports.createArticle = async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    const article = await newArticle.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.searchArticles = async (req, res) => {
  const { query } = req.query;
  try {
    const articles = await Article.find({
      status: 'published',
      $or: [
        { title: { $regex: new RegExp(query, 'i') } },
        { body: { $regex: new RegExp(query, 'i') } },
        { tags: { $in: query.toLowerCase().split(/\s+/) } },
      ],
    });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ msg: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedArticle) return res.status(404).json({ msg: 'Article not found' });
    res.json(updatedArticle);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ msg: 'Article not found' });
    res.json({ msg: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};