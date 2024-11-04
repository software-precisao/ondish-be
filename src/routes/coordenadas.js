const express = require('express');
const router = express.Router();
const latLongController = require('../controller/latlongController');

router.get('/', latLongController.buscarTodasCoordenadas);
router.get('/coordenadas/:id_lat_long', latLongController.buscarCoordenadasPorId);
router.post('/cadastrar', latLongController.adicionarCoordenadas);

module.exports = router;