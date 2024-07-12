const express = require('express');
const router = express.Router();
const funcionarioController = require('../controller/funcionarioController');
const {uploadFields} = require('../helpers/img-uploader');

router.post('/cadastrar', uploadFields, funcionarioController.criarFuncionario);
router.get('/', funcionarioController.obterFuncionario);
router.get('/:id_restaurante', funcionarioController.obterFuncionarioPorId);
router.put('/edit/:id_funcionario', funcionarioController.atualizarFuncionario);
router.delete('/delete/:id_funcionario', funcionarioController.deletarFuncionario);

module.exports = router;