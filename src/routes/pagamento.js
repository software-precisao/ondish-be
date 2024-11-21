const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentController");

router.post("/create-payment-intent", paymentController.createPaymentIntent);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.webhook
);

router.get("/:paymentIntentId", paymentController.getPaymentStatus);

router.post("/realizar-pagamento", paymentController.processarPagamento);

router.post("/associar-cartao", paymentController.associateCardToCustomer);

module.exports = router;
