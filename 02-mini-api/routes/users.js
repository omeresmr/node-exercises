const express = require('express');

const router = express.Router();

router.get('/users/:name', (req, res, then) => {
  res.json({ message: `Hello ${req.params.name}`, requestedAt: req.time });
});

module.exports = router;
