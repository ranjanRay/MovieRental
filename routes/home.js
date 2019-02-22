const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('Welcome to Vidly');
    res.send('Welcome to Vidly');
});

module.exports = router;