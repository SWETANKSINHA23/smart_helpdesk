const router = require('express').Router();
const Config = require('../models/Config');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware(['admin']), async (req, res) => {
  try {
    const config = await Config.findOne({});
    if (!config) {
      const defaultConfig = await Config.create({});
      return res.json(defaultConfig);
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.put('/', authMiddleware(['admin']), async (req, res) => {
  try {
    const config = await Config.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(config);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;