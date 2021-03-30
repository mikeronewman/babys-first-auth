const express = require('express');

const router = express.Router();

// routes here are prepended with /api/v1/notes
router.get('/', (req, res) => {
  res.json([]);
});

module.exports = router;