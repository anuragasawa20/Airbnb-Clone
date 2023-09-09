const express = require('express');
const loginRoutes = require('./loginRoutes');

const router = express.Router();


router.post('/', loginRoutes);



module.exports = router;