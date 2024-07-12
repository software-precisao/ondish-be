const express = require("express");
const router = express.Router();
const pedidoController = require("../controller/pedidoController");

router.post("/novo", pedidoController.criarPedido);
router.post("/item", pedidoController.adicionarItemPedido);
router.get("/:id_pedido", pedidoController.obterPedido);

module.exports = router;