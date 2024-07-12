const express = require("express");

const Status = require("../models/tb_status");

const obterStatus = async (req, res, next) => {
  try {
    const status = await Status.findAll();
    return res.status(200).send({ response: status });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
const obterStatusPorId = async (req, res, next) => {
  try {
    const status = await Nivel.findByPk(req.params.id_status);
    if (status) {
      return res.status(200).send({ response: status });
    } else {
      return res.status(404).send({ message: "Status não encontrado" });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
const criarStatus = async (req, res, next) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const novosStatus = await Status.bulkCreate(data, { validate: true });
    return res.status(201).send({ response: novosStatus });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
const atualizarStatus = async (req, res, next) => {
  try {
    const statusAtualizado = await Status.update(req.body, {
      where: { id_status: req.params.id_status },
    });
    if (statusAtualizado[0]) {
      return res.status(200).send({ message: "Status atualizado com sucesso" });
    } else {
      return res.status(404).send({ message: "Status não encontrado" });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
const deletarStatus = async (req, res, next) => {
  try {
    const deletado = await Status.destroy({
      where: { id_status: req.params.id_status },
    });
    if (deletado) {
      return res.status(200).send({ message: "Status deletado com sucesso" });
    } else {
      return res.status(404).send({ message: "Status não encontrado" });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  obterStatus,
  obterStatusPorId,
  criarStatus,
  atualizarStatus,
  deletarStatus,
};
