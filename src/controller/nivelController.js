const express = require('express');

const Nivel = require('../models/tb_nivel');

const obterNiveis = async (req, res, next) => {
  try {
    const niveis = await Nivel.findAll();
    return res.status(200).send({ response: niveis });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
const obterNivelPorId = async (req, res, next) => {
  try {
    const nivel = await Nivel.findByPk(req.params.id_nivel);
    if (nivel) {
      return res.status(200).send({ response: nivel });
    } else {
      return res.status(404).send({ message: 'Nível não encontrado' });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
const criarNivel = async (req, res, next) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const novosNiveis = await Nivel.bulkCreate(data, { validate: true });
    return res.status(201).send({ response: novosNiveis });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
const atualizarNivel = async (req, res, next) => {
  try {
    const nivelAtualizado = await Nivel.update(req.body, {
      where: { id_nivel: req.params.id_nivel }
    });
    if (nivelAtualizado[0]) {
      return res.status(200).send({ message: 'Nível atualizado com sucesso' });
    } else {
      return res.status(404).send({ message: 'Nível não encontrado' });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
const deletarNivel = async (req, res, next) => {
  try {
    const deletado = await Nivel.destroy({
      where: { id_nivel: req.params.id_nivel }
    });
    if (deletado) {
      return res.status(200).send({ message: 'Nível deletado com sucesso' });
    } else {
      return res.status(404).send({ message: 'Nível não encontrado' });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  obterNiveis,
  obterNivelPorId,
  criarNivel,
  atualizarNivel,
  deletarNivel
};