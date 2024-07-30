const Restaurante = require("../models/tb_restaurante");
const Sala = require("../models/tb_sala");
const SalaConvidado = require("../models/tb_sala_convidado");
const Usuario = require("../models/tb_usuarios");
const AtividadeSala = require("../models/tb_atividades_sala");

const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs").promises;
require("dotenv").config();

// Função para criar uma nova sala
const criarSala = async (req, res) => {
  const {
    nome_sala,
    id_restaurante,
    numero_mesa,
    id_usuario_anfitriao,
    status,
    convidados,
  } = req.body;

  try {
    // Verificar se o usuário anfitrião existe
    const anfitriao = await Usuario.findByPk(id_usuario_anfitriao, {
      attributes: ["id_user", "nome", "sobrenome", "email"],
    });

    if (!anfitriao) {
      return res.status(404).send({ mensagem: "Anfitrião não encontrado." });
    }

    // Criar a sala
    const novaSala = await Sala.create({
      nome_sala,
      numero_mesa,
      id_restaurante,
      id_usuario_anfitriao,
      status,
    });

    await AtividadeSala.create({
      id_sala: novaSala.id_sala,
      id_restaurante: novaSala.id_restaurante,
      descricao: 'Acabou de criar uma sala',
      status: 1
    });


   
    // Adicionar os convidados
    if (Array.isArray(convidados)) {
      await Promise.all(
        convidados.map(async (convidado) => {
          const usuarioConvidado = await Usuario.findByPk(
            convidado.id_usuario_convidado,
            {
              attributes: ["id_user", "nome", "sobrenome", "email"],
            }
          );
          if (!usuarioConvidado) {
            throw new Error(
              `Usuário convidado com id ${convidado.id_usuario_convidado} não encontrado.`
            );
          }

          await SalaConvidado.create({
            id_sala: novaSala.id_sala,
            numero_mesa: novaSala.numero_mesa,
            id_usuario_convidado: convidado.id_usuario_convidado,
            id_restaurante: novaSala.id_restaurante,
            status: convidado.status,
          });

          // Aqui você pode implementar a lógica para enviar a notificação push para cada convidado
          // enviarNotificacaoPush(usuarioConvidado.expoPushToken, 'Você foi convidado!', 'Você foi convidado para uma nova sala.');

          const htmlFilePath = path.join(
            __dirname,
            "../template/sala/convite.html"
          );
          let htmlContent = await fs.readFile(htmlFilePath, "utf8");

          htmlContent = htmlContent
            .replace("{{nome}}", usuarioConvidado.nome)
            .replace("{{anfitriao}}", anfitriao.nome)
            .replace("{{email}}", usuarioConvidado.email)

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
            to: usuarioConvidado.email,
            subject: "🎉 Tem um convite pra você.",
            html: htmlContent,
          };

          let infoConvite = await transporter.sendMail(mailOptions);
          console.log("Mensagem enviada para o convidado: %s", infoConvite.messageId);
        })
      );
    }

    const htmlFilePath = path.join(__dirname, "../template/sala/sala.html");
    let htmlContent = await fs.readFile(htmlFilePath, "utf8");

    htmlContent = htmlContent
      .replace("{{nome}}", anfitriao.nome)
      .replace("{{email}}", anfitriao.email)
      .replace("{{nome_sala}}", novaSala.nome_sala);

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
      to: anfitriao.email,
      subject: "🎉 Você criou uma sala!`,",
      html: htmlContent,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Mensagem enviada: %s", info.messageId);

    res.status(201).json({
      mensagem: "Sala criada com sucesso!",
      sala: novaSala,
    });
  } catch (error) {
    console.error("Erro ao criar sala:", error);
    res.status(400).json({ error: error.message });
  }
};
// Função para listar todas as salas
const listarSalas = async (req, res) => {
  try {
    const salas = await Sala.findAll({
      include: [
        { model: Usuario, as: "anfitriao" },
        { model: Usuario, as: "convidados" },
        { model: Restaurante, as: "restaurante" },
      ],
    });
    res.status(200).json(salas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const verificarConvitesPendentes = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    // Procurar convites pendentes para o usuário
    const convitesPendentes = await SalaConvidado.findAll({
      where: {
        id_usuario_convidado: id_usuario,
        status: "pendente",
      },
      include: [
        {
          model: Sala,
          include: [{ model: Usuario, as: "anfitriao" }],
        },
      ],
    });

    if (convitesPendentes.length > 0) {
      res.status(200).json({
        mensagem:
          "Você foi convidado para uma ou mais salas e ainda não aceitou.",
        convitesPendentes,
      });
    } else {
      res.status(200).json({
        mensagem: "Não há convites pendentes.",
      });
    }
  } catch (error) {
    console.error("Erro ao verificar convites pendentes:", error);
    res.status(400).json({ error: error.message });
  }
};
// Função para atualizar o status do convite
const atualizarStatusConvite = async (req, res) => {
  const { id_usuario, id_sala } = req.params;
  const { status } = req.body;

  try {
    const salainfo = await Sala.findByPk(id_sala, {
      attributes: ["id_sala", "nome_sala", "id_usuario_anfitriao"],
    });

    const anfitriao = await Usuario.findByPk(salainfo.id_usuario_anfitriao, {
      attributes: ["id_user", "nome", "sobrenome", "email"],
    });

    const convidado = await Usuario.findByPk(id_usuario, {
      attributes: ["id_user", "nome", "sobrenome", "email"],
    });

    if (!convidado) {
      return res.status(404).send({ mensagem: "Convidaddo não encontrado." });
    }

    const convite = await SalaConvidado.findOne({
      where: {
        id_usuario_convidado: id_usuario,
        id_sala: id_sala,
      },
    });

    if (!convite) {
      return res.status(404).json({ mensagem: "Convite não encontrado." });
    }

    convite.status = status;
    await convite.save();

    if (req.body.status === "Aceito") {
      const htmlFilePath = path.join(__dirname, "../template/sala/aceito.html");
      let htmlContent = await fs.readFile(htmlFilePath, "utf8");

      htmlContent = htmlContent
        .replace("{{nome}}", anfitriao.nome)
        .replace("{{convidado}}", convidado.nome)
        .replace("{{email}}", anfitriao.email);

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
        to: anfitriao.email,
        subject: "🎉 Convite aceito",
        html: htmlContent,
      };

      let info = await transporter.sendMail(mailOptions);
      console.log("Mensagem enviada: %s", info.messageId);
    } else if (req.body.status === "Recusado") {
      const htmlFilePath = path.join(__dirname, "../template/sala/negado.html");
      let htmlContent = await fs.readFile(htmlFilePath, "utf8");

      htmlContent = htmlContent
        .replace("{{nome}}", anfitriao.nome)
        .replace("{{convidado}}", convidado.nome)
        .replace("{{email}}", anfitriao.email);

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
        to: anfitriao.email,
        subject: "😔 Não foi dessa vez...",
        html: htmlContent,
      };

      let info = await transporter.sendMail(mailOptions);
      console.log("Mensagem enviada: %s", info.messageId);
    }

    res.status(200).json({
      mensagem: "Status do convite atualizado com sucesso.",
      convite,
    });
  } catch (error) {
    console.error("Erro ao atualizar status do convite:", error);
    res.status(400).json({ error: error.message });
  }
};
// Função para obter detalhes de uma sala específica
const obterSala = async (req, res) => {
  const { id } = req.params;
  try {
    const sala = await Sala.findByPk(id, {
      include: [
        { model: Usuario, as: "anfitriao" },
        { model: Usuario, as: "convidados" },
      ],
    });
    if (sala) {
      res.status(200).json(sala);
    } else {
      res.status(404).json({ error: "Sala não encontrada" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletarSala = async (req, res) => {
  const { id } = req.params;
  try {
    const sala = await Sala.findByPk(id);
    if (!sala) {
      return res.status(404).json({ mensagem: "Sala não encontrada." });
    }

    await SalaConvidado.destroy({ where: { id_sala: id } });
    await sala.destroy();

    await AtividadeSala.create({
      id_sala: sala.id_sala,
      id_restaurante: sala.id_restaurante,
      descricao: 'Convivio terminado.',
      status: 1
    });

    res
      .status(200)
      .json({ mensagem: "Sala e convidados deletados com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar sala:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  criarSala,
  listarSalas,
  obterSala,
  verificarConvitesPendentes,
  atualizarStatusConvite,
  deletarSala,
};
