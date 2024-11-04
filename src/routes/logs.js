const express = require('express');
const router = express.Router();
const logPedidoController = require('../controller/logsPedidoController');

router.get('/', logPedidoController.visualizarLogs);
router.get('/:id_pedido', logPedidoController.visualizarLogsById);


module.exports = router;
