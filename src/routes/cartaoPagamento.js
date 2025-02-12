// routes/metodoPagamentoRoutes.js
const express = require("express");
const router = express.Router();
const metodoPagamentoController = require("../controller/cartaoPagamento");

router.post("/cadastrar", metodoPagamentoController.criarMetodoPagamento);
router.get("/:id_user", metodoPagamentoController.getMetodoPagamentoByUserId);
router.delete(
  "/deletar/:id_metodo_pagamento",
  metodoPagamentoController.deleteMetodoPagamento
);

router.put(
  "/editar/:id_metodo_pagamento",
  metodoPagamentoController.editarMetodoPagamento
);

router.put(
  "/prefedenir_cartao/:id_metodo_pagamento",
  metodoPagamentoController.definirCartaoPredefinido
);

module.exports = router;
