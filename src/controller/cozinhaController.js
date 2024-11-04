const Cozinha = require('../models/tb_cozinha');

const obterCozinhas = async (req, res) => {
  try {
    const cozinhas = await Cozinha.findAll();
    return res.status(200).send({ response: cozinhas });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const obterCozinhaPorId = async (req, res) => {
  try {
    const cozinha = await Cozinha.findByPk(req.params.id_cozinha);
    if (cozinha) {
      return res.status(200).send({ response: cozinha });
    } else {
      return res.status(404).send({ message: 'Cozinha não encontrada' });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const criarCozinha = async (req, res, next) => {

  try {
    const novaCozinha = await Cozinha.create(req.body);
    return res.status(201).send({ response: novaCozinha });
  } catch (error) {
    console.log()
    return res.status(500).send({ error: error.message });
  }
};

const atualizarCozinha = async (req, res) => {
  try {
    const atualizado = await Cozinha.update(req.body, {
      where: { id_cozinha: req.params.id_cozinha }
    });
    if (atualizado[0]) {
      return res.status(200).send({ message: 'Cozinha atualizada com sucesso' });
    } else {
      return res.status(404).send({ message: 'Cozinha não encontrada' });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const deletarCozinha = async (req, res) => {
  try {
    const deletado = await Cozinha.destroy({
      where: { id_cozinha: req.params.id_cozinha }
    });
    if (deletado) {
      return res.status(200).send({ message: 'Cozinha deletada com sucesso' });
    } else {
      return res.status(404).send({ message: 'Cozinha não encontrada' });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  obterCozinhas,
  obterCozinhaPorId,
  criarCozinha,
  atualizarCozinha,
  deletarCozinha
};
