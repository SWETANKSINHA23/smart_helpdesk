const router = require('express').Router();
const kbController = require('../controllers/kbController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware(['admin']), kbController.createArticle);
router.get('/', kbController.searchArticles);
router.get('/:id', kbController.getArticleById);
router.put('/:id', authMiddleware(['admin']), kbController.updateArticle);
router.delete('/:id', authMiddleware(['admin']), kbController.deleteArticle);

module.exports = router;