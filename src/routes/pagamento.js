const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');

router.post('/mbway', paymentController.createMBWayPayment);
router.post('/multibanco', paymentController.createMultibancoReference);
router.get('/status/:trid', paymentController.getPaymentStatus);
router.get('/', paymentController.getPaymentsByDateRange);

module.exports = router;