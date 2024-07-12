const express = require('express');
const router = express.Router();
const salaController = require('../controller/salaController');

// Rotas para Sala
router.post('/nova-sala', salaController.criarSala);
router.get('/', salaController.listarSalas);
router.get("/convites/pendentes/:id_usuario", salaController.verificarConvitesPendentes);
router.put("/convite/:id_sala/:id_usuario", salaController.atualizarStatusConvite);
router.get('/:id', salaController.obterSala);
router.delete("/:id", salaController.deletarSala);



module.exports = router;