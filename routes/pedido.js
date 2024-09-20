const express = require('express');
const router = express.Router();
const pedidosController = require('../controller/pedidoController');

router.post('/novo', pedidosController.criarPedidoComItens);
router.get('/meu-pedido/:id_pedido', pedidosController.obterPedido);
router.get('/restaurante/:id_restaurante', pedidosController.obterPedidoRestaurante);
router.get('/status/:id_pedido', pedidosController.obterStatusPedido);
router.put('/edit/status', pedidosController.atualizarStatusPedido);
router.get('/meu-pedidos/:id_usuario/:id_mesa', pedidosController.obterPedidoPorUsuarioMesa);
module.exports = router;