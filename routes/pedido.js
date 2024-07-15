const express = require('express');
const router = express.Router();
const pedidosController = require('../controller/pedidoController');

router.post('/novo', pedidosController.criarPedidoComItens);
// router.get('/meu-pedido/:id_pedido', pedidosController.obterPedido);
router.get('/status/:id_pedido', pedidosController.obterStatusPedido);
router.put('/edit/status', pedidosController.atualizarStatusPedido);

module.exports = router;