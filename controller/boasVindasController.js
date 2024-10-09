const express = require("express");
const BoasVindas = require("../models/tb_boas_vindas");

const obterBoasVindas = async (req, res, next) => {
  try {
    const boasVindas = await BoasVindas.findAll();
    return res.status(200).send({ response: boasVindas });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};


const criarBoasVindas = async (req, res, next) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const novasBoasVindas = await BoasVindas.bulkCreate(data, {
      validate: true,
    });
    return res.status(201).send({ response: novasBoasVindas });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const atualizarBoasVindas = async (req, res, next) => {
  try {
    const boasVindasAtualizada = await BoasVindas.update(req.body, {
      where: { id: req.params.id },
    });
    if (boasVindasAtualizada[0]) {
      return res
        .status(200)
        .send({
          message: "Configuração de boas-vindas atualizada com sucesso",
        });
    } else {
      return res
        .status(404)
        .send({ message: "Configuração de boas-vindas não encontrada" });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const deletarBoasVindas = async (req, res, next) => {
  try {
    const deletado = await BoasVindas.destroy({
      where: { id: req.params.id },
    });
    if (deletado) {
      return res
        .status(200)
        .send({ message: "Configuração de boas-vindas deletada com sucesso" });
    } else {
      return res
        .status(404)
        .send({ message: "Configuração de boas-vindas não encontrada" });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  obterBoasVindas,
  criarBoasVindas,
  atualizarBoasVindas,
  deletarBoasVindas,
};
