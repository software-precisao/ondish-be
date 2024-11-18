const bcrypt = require("bcrypt");

const Usuario = require("../models/tb_usuarios");
const Code = require("../models/tb_code");
const Token = require("../models/tb_token");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const PreferenciasUsuario = require("../models/tb_preferencias_user");
const { sendPushNotification } = require("../utils/pushNotification");
// const { sendSms } = require('../utils/smsToken')
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const nodemailer = require("nodemailer");
const path = require("path");
const { Sequelize } = require("sequelize");
const fs = require("fs").promises;
require("dotenv").config();

const enviarEmail = async (
  destinatario,
  assunto,
  templatePath,
  placeholders
) => {
  try {
    const htmlContent = await fs.readFile(templatePath, "utf8");
    const htmlWithPlaceholders = Object.keys(placeholders).reduce(
      (content, placeholder) =>
        content.replace(`{{${placeholder}}}`, placeholders[placeholder]),
      htmlContent
    );

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

    const mailOptions = {
      from: `"Equipa Ondish Foods" <${process.env.EMAIL_FROM}>`,
      to: destinatario,
      subject: assunto,
      html: htmlWithPlaceholders,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Mensagem enviada: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return false;
  }
};

const registrarNumeroTelefone = async (req, res) => {
  try {
    const { numero_telefone, id_nivel, id_status } = req.body;

    const usuarioExistente = await Usuario.findOne({
      where: { numero_telefone },
    });
    if (usuarioExistente) {
      return res
        .status(400)
        .send({ mensagem: "Número de telefone já cadastrado." });
    }

    const novoUsuario = await Usuario.create({
      numero_telefone: numero_telefone,
      id_nivel: 3,
      id_status: 1,
    });

    const codigoAleatorio = Math.floor(1000 + Math.random() * 9000).toString();

    const code = await Code.create({
      type_code: 1,
      code: codigoAleatorio,
      id_user: novoUsuario.id_user,
    });

    return res.status(201).send({
      mensagem: "Número de telefone registrado com sucesso.",
      id_user: novoUsuario.id_user,
      code: code,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
};

//CÓDIGO COM O ENVIO DE SMS, TEM QUE CORRIGIR QUANDO CONSEGUIR AS CHAVES
// const registrarNumeroTelefone = async (req, res) => {
//   try {
//     const { numero_telefone, id_nivel, id_status } = req.body;

//     const usuarioExistente = await Usuario.findOne({
//       where: { numero_telefone },
//     });
//     if (usuarioExistente) {
//       return res
//         .status(400)
//         .send({ mensagem: "Número de telefone já cadastrado." });
//     }

//     const smsResponse = await sendSms(numero_telefone, "Código de verificação");

//     if (!smsResponse || !smsResponse.code) {
//       return res
//         .status(500)
//         .send({ error: "Falha ao enviar SMS de verificação." });
//     }

//     const novoUsuario = await Usuario.create({
//       numero_telefone,
//       id_nivel: id_nivel || 3,
//       id_status: id_status || 1,
//     });

//     await Code.create({
//       type_code: 1,
//       code: smsResponse.code,
//       id_user: novoUsuario.id_user,
//     });

//     return res.status(201).send({
//       mensagem:
//         "Número de telefone registrado com sucesso. Verifique o SMS enviado para concluir o cadastro.",
//       id_user: novoUsuario.id_user,
//     });
//   } catch (error) {
//     console.error("Erro ao registrar número de telefone:", error.message);
//     return res
//       .status(500)
//       .send({ error: "Erro interno ao registrar número de telefone." });
//   }
// };

const concluirRegistro = async (req, res) => {
  try {
    const { id_user } = req.params;
    const {
      senha,
      pin_registro,
      nome,
      sobrenome,
      email,
      avatar,
      config,
      token_notification,
    } = req.body;

    const usuario = await Usuario.findOne({ where: { id_user } });
    if (!usuario) {
      return res.status(404).send({ mensagem: "Usuário não encontrado." });
    }

    const usuarioExistente = await Usuario.findOne({
      where: {
        email,
        id_user: { [Sequelize.Op.ne]: id_user },
      },
    });
    if (usuarioExistente) {
      return res.status(400).send({ mensagem: "Email já cadastrado." });
    }

    if (usuario.pin_registro !== pin_registro) {
      return res.status(401).send({ mensagem: "PIN inválido." });
    }

    await Usuario.update(
      {
        nome,
        sobrenome,
        email,
        senha: await bcrypt.hash(senha, 10),
        avatar,
        config,
        token_notification: token_notification || usuario.token_notification,
      },
      { where: { id_user } }
    );

    const preferenciasExistentes = await PreferenciasUsuario.findOne({
      where: { id_user },
    });

    if (!preferenciasExistentes) {
      await PreferenciasUsuario.create({
        id_user,
        notificacoes_pedido: true,
        notificacoes_dicas_e_promocao: false,
        email_dicas_e_promocao: true,
        notificacoes_ofertas_parceiros: false,
        email_ofertas_parceiros: true,
      });
    }

    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    let stripeCustomerId;
    if (existingCustomers.data.length > 0) {
      stripeCustomerId = existingCustomers.data[0].id;
    } else {
      const newCustomer = await stripe.customers.create({
        name: `${nome} ${sobrenome}`,
        email: email,
      });
      stripeCustomerId = newCustomer.id;
    }

    await Usuario.update(
      { stripeCustomerId: stripeCustomerId },
      { where: { id_user } }
    );

    return res
      .status(200)
      .send({ mensagem: "Registro concluído com sucesso." });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
};

const enviarNotificacaoUsuario = async (req, res) => {
  try {
    const { id_user } = req.params;
    const { title, body, image } = req.body;

    const usuario = await Usuario.findOne({ where: { id_user } });
    if (!usuario || !usuario.token_notification) {
      return res
        .status(404)
        .json({ mensagem: "Usuário ou token de notificação não encontrado." });
    }

    await sendPushNotification(usuario.token_notification, title, body, image);

    return res
      .status(200)
      .json({ mensagem: "Notificação enviada com sucesso." });
  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
    return res
      .status(500)
      .json({ mensagem: "Erro ao enviar notificação.", error: error.message });
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

    const documentoIdentidade = req.files.documento
      ? req.files.documento[0].filename
      : "default-documento.png";

    const novoUsuario = await Usuario.create({
      nome: req.body.nome,
      sobrenome: req.body.sobrenome,
      email: req.body.email,
      numero_telefone: req.body.numero_telefone,
      senha: hashedPassword,
      id_nivel: 2,
      id_status: 1,
      avatar: `/avatar/${filename}`,
      config: 2,
      nif: req.body.nif,
      data_nascimento: req.body.data_nascimento,
      logradouro: req.body.logradouro,
      cidade: req.body.cidade,
      estado: req.body.estado,
      cep: req.body.cep,
      imagem_documento_identidade: `/documento/${documentoIdentidade}`,
      numero_identificacao: req.body.numero_identificacao,

    });

    const tokenUsuario = await Token.create({
      id_user: novoUsuario.id_user,
      token: uuidv4(),
    });

    const response = {
      mensagem: "Usuário cadastrado com sucesso e Token único gerado!",
      usuarioCriado: {
        id_user: novoUsuario.id_user,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        nivel: novoUsuario.id_nivel,
        token_unico: tokenUsuario.token,
        request: {
          tipo: "GET",
          descricao: "Pesquisar um usuário",
          url: `https://trustchecker.com.br/api/usuarios/${novoUsuario.id_user}`,
        },
      },
    };

    return res.status(202).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
};

const atualizarSenhaUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { senha } = req.body;

    if (!senha) {
      return res.status(400).send({
        mensagem: "A senha é obrigatória!",
      });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).send({
        mensagem: "Usuário não encontrado!",
      });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    await usuario.update({ senha: hashedPassword });

    res.status(200).send({
      mensagem: "Senha atualizada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    return res.status(500).send({ error: error.message });
  }
};

const recuperarSenha = async (req, res, next) => {
  try {
    const { numero_telefone } = req.body;

    const usuarioExistente = await Usuario.findOne({
      where: { numero_telefone },
    });

    if (!usuarioExistente) {
      return res.status(404).send({
        mensagem: "Número de telefone não encontrado!",
      });
    }

    const codigoAleatorio = Math.floor(1000 + Math.random() * 9000).toString();

    const code = await Code.create({
      type_code: 2,
      code: codigoAleatorio,
      id_user: usuarioExistente.id_user,
    });

    return res.status(200).send({
      mensagem: "Código de recuperação enviado com sucesso!",
      id_user: usuarioExistente.id_user,
    });
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

    const usuario = await Usuario.findByPk(req.params.id_user);
    if (!usuario) {
      console.log("Usuário não encontrado para o ID:", req.params.id_user);
      return res.status(404).send({ message: "Usuário não encontrado" });
    }

    const { nome, sobrenome, email, numero_telefone, token_notification } =
      req.body;

    if (email) {
      const emailExistente = await Usuario.findOne({
        where: {
          email,
          id_user: { [Op.ne]: req.params.id_user },
        },
      });
      if (emailExistente) {
        return res
          .status(400)
          .send({ message: "Email já cadastrado por outro usuário." });
      }
    }

    if (numero_telefone) {
      const telefoneExistente = await Usuario.findOne({
        where: {
          numero_telefone,
          id_user: { [Op.ne]: req.params.id_user },
        },
      });
      if (telefoneExistente) {
        return res.status(400).send({
          message: "Número de telefone já cadastrado por outro usuário.",
        });
      }
    }

    if (req.files && req.files.avatar) {
      req.body.avatar = `/avatar/${req.files.avatar[0].filename}`;
    }

    await usuario.update({
      nome,
      sobrenome,
      email,
      numero_telefone,
      avatar: req.body.avatar || usuario.avatar,
      token_notification: token_notification || usuario.token_notification,
    });

    res.status(200).send({
      mensagem: "Usuário atualizado com sucesso!",
      usuarioAtualizado: usuario,
    });
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

const trocaSenha = async (req, res, next) => {
  try {
    const userId = req.params.id_user;

    if (!userId) {
      return res.status(400).send({ message: "ID do usuário não fornecido" });
    }

    const usuario = await Usuario.findByPk(userId);

    if (!usuario) {
      return res.status(404).send({ message: "Usuário não encontrado" });
    }

    const hashedPassword = await bcrypt.hash(req.body.senha, 10);
    usuario.senha = hashedPassword;

    await usuario.save();

    return res.status(200).send({ mensagem: "Senha alterada com sucesso!" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const trocaSenhaporEmail = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Email não fornecido" });
    }

    const usuario = await Usuario.findOne({ where: { email: email } });

    if (!usuario) {
      return res.status(404).send({ message: "Usuário não encontrado" });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    usuario.senha = hashedPassword;

    await usuario.save();

    return res.status(200).send({ mensagem: "Senha alterada com sucesso!" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  criarUsuarioRestaurante,
  recuperarSenha,
  verificarCodigo,
  obterUsuarios,
  obterUsuarioPorId,
  atualizarUsuario,
  atualizarSenhaUsuario,
  deletarUsuario,
  trocaSenha,
  trocaSenhaporEmail,
  registrarNumeroTelefone,
  concluirRegistro,
  enviarEmail,
  enviarNotificacaoUsuario,
};
