// routes/metodoPagamentoRoutes.js
const express = require("express");
const router = express.Router();
const metodoPagamentoController = require("../controller/cartaoPagamento");

router.post(
  "/cadastrar",
  metodoPagamentoController.criarMetodoPagamento
);
router.get(
  "/:id_user",
  metodoPagamentoController.getMetodoPagamentoByUserId
);
router.delete(
  "/deletar/:id_user",
  metodoPagamentoController.deleteMetodoPagamento
);

module.exports = router;
