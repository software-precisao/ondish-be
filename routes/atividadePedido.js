const express = require('express');
const router = express.Router();
const atividadePedidoController = require('../controller/atividadePedidoController');


router.get('/', atividadePedidoController.obterAtividadesPedido);

router.get('/restaurante/:id_restaurante', atividadePedidoController.obterAtividadesPedidoPorRestaurante);

router.put('/atividades_pedido/:id_atividade_pedido', atividadePedidoController.atualizarAtividadePedido);

router.delete('/delete/:id_atividade_pedido', atividadePedidoController.deletarAtividadePedido);

module.exports = router;