const express = require("express");
const Token = require("../models/tb_token");

const criarToken = async (req, res) => {
  try {
    const { token } = req.body;
    const novoToken = await Token.create({ token });
    res.status(201).send(novoToken);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const buscarTodosTokens = async (req, res) => {
  try {
    const tokens = await Token.findAll();
    res.send(tokens);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const buscarTokenPorId = async (req, res) => {
  try {
    const id_user = req.params.id_user;
    const token = await Token.findByPk(id_user);
    if (!token) {
      return res.status(404).send({ mensagem: "Token não encontrado." });
    }
    res.send(token);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const atualizarToken = async (req, res) => {
  try {
    const id = req.params.id;
    const { token } = req.body;

    const tokenExistente = await Token.findByPk(id);
    if (!tokenExistente) {
      return res.status(404).send({ mensagem: "Token não encontrado." });
    }

    tokenExistente.token = token;
    await tokenExistente.save();

    res.send({ mensagem: "Token atualizado com sucesso!", token: tokenExistente });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const deletarToken = async (req, res) => {
  try {
    const id = req.params.id;
    const token = await Token.findByPk(id);
    if (!token) {
      return res.status(404).send({ mensagem: "Token não encontrado." });
    }

    await token.destroy();
    res.send({ mensagem: "Token deletado com sucesso!" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  criarToken,
  buscarTodosTokens,
  buscarTokenPorId,
  atualizarToken,
  deletarToken
};
