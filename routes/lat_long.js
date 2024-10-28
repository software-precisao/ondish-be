const express = require('express');
const router = express.Router();
const latLongController = require('../controller/latlongController');

// Rota para buscar todas as coordenadas
router.get('/', latLongController.buscarTodasCoordenadas);

// Rota para buscar uma coordenada específica por ID
router.get('/:id', latLongController.buscarCoordenadasPorId);

// Rota para atualizar uma coordenada por ID
router.put('/editar/:id', latLongController.atualizarCoordenada);

// Rota para adicionar uma nova coordenada
router.post('/cadastrar', latLongController.adicionarCoordenadas);

// Rota para remover uma coordenada por ID
router.delete('/deletar/:id', latLongController.removerCoordenada);

module.exports = router;
