const express = require('express');
const router = express.Router();
const atividadeSalaController = require('../controller/atividadeSalaController');

// Rota para obter todas as atividades de sala
router.get('/', atividadeSalaController.obterAtividadesSala);
router.get('/restaurante/:id_restaurante', atividadeSalaController.obterAtividadeSalaPorRestaurante);

// Rota para atualizar atividade de sala
router.put('/edit/:id_atividade_sala', atividadeSalaController.atualizarAtividadeSala);

// Rota para deletar atividade de sala
router.delete('/delete/:id_atividade_sala', atividadeSalaController.deletarAtividadeSala);

module.exports = router;    