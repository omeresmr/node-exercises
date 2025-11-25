const express = require('express');

const router = express.Router();

router.get('/about', (req, res, then) => {
  res.json({ page: 'about', time: req.time });
});

module.exports = router;
