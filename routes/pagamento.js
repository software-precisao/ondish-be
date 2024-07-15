const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');

router.post('/pagamento-card', paymentController.processPayment);

/**
 * @swagger
 * tags:
 *   name: Pagamentos
 *   description: Gerenciamento de pagamentos
 */

/**
 * @swagger
 * /payment/create-session:
 *   post:
 *     summary: Cria uma nova sessão de pagamento
 *     tags: [Pagamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     price_data:
 *                       type: object
 *                       properties:
 *                         currency:
 *                           type: string
 *                           example: "usd"
 *                         product_data:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               example: "T-shirt"
 *                         unit_amount:
 *                           type: integer
 *                           example: 2000
 *                     quantity:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       200:
 *         description: Sessão de pagamento criada com sucesso
 *       500:
 *         description: Erro ao criar sessão de pagamento
 */
router.post('/create-session', paymentController.createPaymentSession);

/**
 * @swagger
 * /payment/webhook:
 *   post:
 *     summary: Webhook para receber eventos da Stripe
 *     tags: [Pagamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook recebido com sucesso
 *       400:
 *         description: Erro ao processar webhook
 */
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

module.exports = router;