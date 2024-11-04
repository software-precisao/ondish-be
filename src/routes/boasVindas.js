const express = require('express');
const router = express.Router();
const boasVindasController = require('../controller/boasVindasController');

router.get('/', boasVindasController.obterBoasVindas);

router.post('/cadastrar', boasVindasController.criarBoasVindas);

router.put('/editar/:id', boasVindasController.atualizarBoasVindas);

router.delete('/deletar/:id', boasVindasController.deletarBoasVindas);

module.exports = router;
