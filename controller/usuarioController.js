const bcrypt = require("bcrypt");

const Usuario = require("../models/tb_usuarios");
const Code = require("../models/tb_code");
const Token = require("../models/tb_token");
const { v4: uuidv4 } = require("uuid");

const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs").promises;
require("dotenv").config();

const criarUsuario = async (req, res, next) => {
  try {
    const usuarioExistente = await Usuario.findOne({
      where: { email: req.body.email },
    });

    if (usuarioExistente) {
      return res.status(409).send({
        mensagem: "Email já cadastrado, por favor insira um email diferente!",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.senha, 10);
      const filename = req.files.avatar
      ? req.files.avatar[0].filename
      : "default-avatar.png";

    const novoUsuario = await Usuario.create({
      nome: req.body.nome,
      sobrenome: req.body.sobrenome,
      email: req.body.email,
      senha: hashedPassword,
      id_nivel: 3,
      id_status: 1,
      avatar: `/avatar/${filename}`,
      
    });

    const codigoAleatorio = Math.floor(1000 + Math.random() * 9000).toString();

    const code = await Code.create({
      type_code: 1,
      code: codigoAleatorio,
      id_user: novoUsuario.id_user,
    });

    const htmlFilePath = path.join(__dirname, "../template/code/index.html");
    let htmlContent = await fs.readFile(htmlFilePath, "utf8");

    htmlContent = htmlContent
      .replace("{{nome}}", novoUsuario.nome)
      .replace("{{email}}", novoUsuario.email)
      .replace("{{code}}", code.code);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        ciphers: "TLSv1",
      },
    });

    let mailOptions = {
      from: `"Equipa Ondish Foods" ${process.env.EMAIL_FROM}`,
      to: req.body.email,
      subject: "🔒 Código de verificação Ondish!`,",
      html: htmlContent,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Mensagem enviada: %s", info.messageId);

    const tokenUsuario = await Token.create({
      id_user: novoUsuario.id_user,
      token: uuidv4(),
    });

    const response = {
      mensagem: "Usuário cadastrado com sucesso e Token unico gerado!",
      usuarioCriado: {
        id_user: novoUsuario.id_user,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        nivel: novoUsuario.id_nivel,
        token_unico: tokenUsuario.token,
        code: code.code,
        request: {
          tipo: "GET",
          descricao: "Pesquisar um usuário",
          url: `https://trustchecker.com.br/api//usuarios/${novoUsuario.id_user}`,
        },
      },
    };

    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
const criarUsuarioRestaurante = async (req, res, next) => {
  try {
    const usuarioExistente = await Usuario.findOne({
      where: { email: req.body.email },
    });

    if (usuarioExistente) {
      return res.status(409).send({
        mensagem: "Email já cadastrado, por favor insira um email diferente!",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.senha, 10);
    const filename = req.files.avatar
      ? req.files.avatar[0].filename
      : "default-avatar.png";

    const novoUsuario = await Usuario.create({
      nome: req.body.nome,
      sobrenome: req.body.sobrenome,
      email: req.body.email,
      senha: hashedPassword,
      id_nivel: 2,
      id_status: 1,
      avatar: `/avatar/${filename}`,
      config: 2,
    });

    const tokenUsuario = await Token.create({
      id_user: novoUsuario.id_user,
      token: uuidv4(),
    });

    const response = {
      mensagem: "Usuário cadastrado com sucesso e Token unico gerado!",
      usuarioCriado: {
        id_user: novoUsuario.id_user,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        nivel: novoUsuario.id_nivel,
        token_unico: tokenUsuario.token,
        request: {
          tipo: "GET",
          descricao: "Pesquisar um usuário",
          url: `https://trustchecker.com.br/api//usuarios/${novoUsuario.id_user}`,
        },
      },
    };

    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
const verificarCodigo = async (req, res) => {
  try {
    const { id_user, code } = req.body;

    const userCode = await Code.findOne({
      where: {
        id_user: id_user,
        code: code,
      },
    });

    if (userCode) {
      return res
        .status(200)
        .send({ mensagem: "Código verificado com sucesso!" });
    } else {
      return res
        .status(400)
        .send({ mensagem: "Código inválido ou não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao verificar código: ", error);
    return res
      .status(500)
      .send({ mensagem: "Erro ao verificar código", error: error.message });
  }
};
const obterUsuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuario.findAll();
    return res.status(200).send({ response: usuarios });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
const obterUsuarioPorId = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).send({ message: "Usuário não encontrado" });
    }
    res.status(200).send(usuario);
  } catch (error) {
    next(error);
  }
};
const atualizarUsuario = async (req, res, next) => {
  try {
    console.log(
      "Requisição recebida para atualizar usuário com ID:",
      req.params.id_user
    );
    const [updated] = await Usuario.update(req.body, {
      where: { id_user: req.params.id_user },
    });
    if (updated) {
      const updatedUsuario = await Usuario.findByPk(req.params.id_user);
      res.status(200).send(updatedUsuario);
    } else {
      console.log("Usuário não encontrado para o ID:", req.params.id_user);
      res.status(404).send({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    next(error);
  }
};
const deletarUsuario = async (req, res, next) => {
  try {
    const deleted = await Usuario.destroy({
      where: { id_user: req.params.id_user },
    });
    if (deleted) {
      res.status(200).send({ message: "Usuário deletado com sucesso" });
    } else {
      res.status(404).send({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarUsuario,
  criarUsuarioRestaurante,
  verificarCodigo,
  obterUsuarios,
  obterUsuarioPorId,
  atualizarUsuario,
  deletarUsuario,
};
