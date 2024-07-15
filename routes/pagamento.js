const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');

router.post('/pagamento-card', paymentController.processPayment);


module.exports = router;