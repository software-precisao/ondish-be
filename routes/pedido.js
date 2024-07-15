const express = require('express');
const router = express.Router();
const pedidosController = require('../controller/pedidoController');

router.post('/novo', pedidosController.criarPedidoComItens);
router.post('/itens', pedidosController.obterPedido);
router.get('/meu-pedido/:id_pedido', pedidosController.obterPedido);
router.put('/edit/status', pedidosController.atualizarStatusPedido);

module.exports = router;