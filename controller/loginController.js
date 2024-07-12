const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/tb_usuarios");
const Logado = require("../models/tb_logout");
const Restaurante = require("../models/tb_restaurante");
const Sala  = require("../models/tb_sala");
const SalaConvidado = require("../models/tb_sala_convidado");

const autenticarUsuarioApp = async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    const user = await Usuario.findOne({ where: { email: email } });

    if (!user) {
      return res.status(401).send({
        mensagem: "Falha na autenticação.",
      });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (isPasswordValid) {
      await Logado.update(
        { status: 0 },
        { where: { id_user: user.id_user, status: 1 } }
      );
   
      const salaAnfitriao = await Sala.findOne({
        where: { id_usuario_anfitriao: user.id_user },
      });
      const salaConvidado = await SalaConvidado.findOne({
        where: { id_usuario_convidado: user.id_user },
      });

      let role = "usuario";
      let salaId = null;

      if (salaAnfitriao) {
        role = "anfitriao";
        salaId = salaAnfitriao.id_sala;
      } else if (salaConvidado) {
        role = "convidado";
        salaId = salaConvidado.id_sala;
      }

      const token = jwt.sign(
        {
          id_user: user.id_user,
          nome: user.nome,
          sobrenome: user.sobrenome,
          email: user.email,
          avatar: user.avatar,
          id_nivel: user.id_nivel,
          id_status: user.id_status,
          config: user.config,
          role: role,
          salaId: salaId,
        },
        process.env.JWT_KEY,
        { expiresIn: "6h" }
      );

      // Cria novo registro de login como ativo
      await Logado.create({
        id_user: user.id_user,
        status: 1,
      });

      return res.status(200).send({
        mensagem: "Autenticado com sucesso!",
        token: token,
        id_status: user.id_status,
        id_nivel: user.id_nivel,
        role: role,
        salaId: salaId,
      });
    } else {
      return res.status(401).send({ mensagem: "Falha na autenticação." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
};


const autenticarUsuarioRestaurante = async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    const user = await Usuario.findOne({ where: { email: email } });

    if (!user) {
      return res.status(401).send({
        mensagem: "Falha na autenticação.",
      });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (isPasswordValid) {
     
      await Logado.update({ status: 0 }, { where: { id_user: user.id_user, status: 1 } });
      const restaurante = await Restaurante.findOne({ where: { id_user: user.id_user } });

   
      const token = jwt.sign(
        {
          id_user: user.id_user,
          nome: user.nome,
          sobrenome: user.sobrenome,
          email: user.email,
          avatar: user.avatar,
          id_nivel: user.id_nivel,
          id_status: user.id_status,
          config: user.config,
          restaurante: restaurante ? {
            id_restaurante: restaurante.id_restaurante,
            nome_restaurante: restaurante.nome_restaurante,
            nif: restaurante.nif,
            ibam: restaurante.ibam,
            website: restaurante.website,
            facebook: restaurante.facebook,
            logo: restaurante.logo,
            capa: restaurante.capa,
            instagram: restaurante.instagram,
            telefone1: restaurante.telefone1,
            telefone2: restaurante.telefone2,
            morada: restaurante.morada,
            codigo_postal: restaurante.codigo_postal,
            qrcode: restaurante.qrcode,
          } : null
        },
        process.env.JWT_KEY,
        { expiresIn: "6h" }
      );

      // Cria novo registro de login como ativo
      await Logado.create({
        id_user: user.id_user,
        status: 1,
      });

      return res.status(200).send({
        mensagem: "Autenticado com sucesso!",
        token: token,
        id_status: user.id_status,
        id_nivel: user.id_nivel
      });
    } else {
      return res.status(401).send({ mensagem: "Falha na autenticação." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
};

const logoutUsuario = async (req, res) => {
  try {
    const { id_user } = req.params;
    const novoStatus = 0;

    const resultado = await Logado.update(
      { status: novoStatus },
      { where: { id_user: id_user } }
    );

    await registrarLog("Usuário deslogado", id_user);

    if (resultado[0] > 0) {
      return res
        .status(200)
        .send({ mensagem: "Logout realizado com sucesso." });
    } else {
      return res.status(404).send({
        mensagem: "Registro de login não encontrado para atualização.",
      });
    }
  } catch (error) {
    console.error("Erro ao realizar logout:", error);
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  autenticarUsuarioApp,
  autenticarUsuarioRestaurante,
  logoutUsuario,
};
