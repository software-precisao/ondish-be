const express = require('express');
const router = express.Router();
const salaController = require('../controller/salaController');

// Rotas para Sala
router.get('/verifica-anfitriao/:id_mesa', salaController.verificaAnfitriao);
router.post('/nova-sala/', salaController.criarSala);
router.post('/convidado', salaController.convidado);
router.get('/', salaController.listarSalas);
router.get("/convites/pendentes/:id_usuario", salaController.verificarConvitesPendentes);
router.put("/convite/:id_sala/:id_usuario", salaController.atualizarStatusConvite);
router.put("/entrar/:id_sala/:id_usuario", salaController.entrarSala);
router.get('/:id', salaController.obterSala);
router.delete("/:id", salaController.deletarSala);


module.exports = router;