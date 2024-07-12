const express = require('express');
const router = express.Router();
const avaliacaoController = require('../controller/avaliacaoController');

// Rota para criar uma nova avaliação
router.post('/enviar', avaliacaoController.criarAvaliacao);
router.get('/', avaliacaoController.buscarTodasAvaliacoes);
router.get('/:id', avaliacaoController.buscarAvaliacaoPorId);
router.put('/:id', avaliacaoController.atualizarAvaliacao);
router.delete('/:id', avaliacaoController.deletarAvaliacao);

module.exports = router;
