const Restaurante = require("../models/tb_restaurante");
const Sala = require("../models/tb_sala");
const SalaConvidado = require("../models/tb_sala_convidado");
const Usuario = require("../models/tb_usuarios");
const AtividadeSala = require("../models/tb_atividades_sala");

const nodemailer = require("nodemailer");
const path = require("path");
const Mesa = require("../models/tb_mesa");
const fs = require("fs").promises;
require("dotenv").config();

const editarStatusSala = async (req, res) => {
  const { id_sala } = req.params;
  const { status } = req.body;

  try {
    const sala = await Sala.findByPk(id_sala);
    if (!sala) {
      return res.status(404).json({ mensagem: "Sala não encontrada." });
    }

    await sala.update({ status });
    res
      .status(200)
      .json({ mensagem: "Status da sala atualizado com sucesso.", sala });
  } catch (error) {
    console.error("Erro ao atualizar o nome da sala:", error);
    res.status(500).json({ mensagem: "Erro ao atualizar o nome da sala." });
  }
};

const getSalasPorUsuario = async (req, res) => {
  const { id_user } = req.params;

  try {
    const convites = await SalaConvidado.findAll({
      where: { id_usuario_convidado: id_user },
      include: [
        {
          model: Sala,
          as: "salas",
        },
      ],
    });

    const salasAnfitriao = await Sala.findAll({
      where: { id_usuario_anfitriao: id_user },
    });

    const listaConvites = convites.map((convite) => convite.toJSON());

    const listaSalasConvites = listaConvites
      .map((convite) => convite.sala)
      .filter(Boolean);

    const listaSalas = [...listaSalasConvites, ...salasAnfitriao];

    res.status(200).json({
      mensagem: `Dados para o usuário ${id_user} obtidos com sucesso.`,
      convites: listaConvites,
      salas: listaSalas,
    });
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error);
    res.status(500).json({ mensagem: "Erro ao obter dados do usuário." });
  }
};


// Verifica se o usuário é um anfitrião
const verificaAnfitriao = async (req, res) => {
  try {
    const { id_mesa } = req.params;

    const sala = await Sala.findOne({
      where: {
        id_mesa: id_mesa,
        status_anfitriao: 1,
      },
    });

    // Verifica se a sala foi encontrada e se tem um anfitrião
    if (sala) {
      // Já tem um anfitrião, então retorna a mensagem
      return res.status(200).json({
        status: "convidado",
        mensagem: "Já tem um anfitrião na mesa, entre como convidado.",
        id_sala: sala.id_sala,
        id_restaurante: sala.id_restaurante,
        sala: sala.nome_sala,
      });
    } else {
      // Não encontrou sala com anfitrião, então a mesa está livre
      return res.status(200).json({
        status: "livre",
        mensagem: "Mesa Livre! Seja o anfitrião.",
      });
    }
  } catch (error) {
    console.error("error message", error.message);
    console.error("error stack", error.stack);
    return res.status(500).json({ error: "Erro ao verificar anfitrião." });
  }
};
// Função para criar uma nova sala
const criarSala = async (req, res) => {
  const {
    nome_sala,
    id_restaurante,
    id_mesa,
    numero_mesa,
    id_usuario_anfitriao,
    status_anfitriao,
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
      id_mesa,
      id_usuario_anfitriao,
      status_anfitriao,
    });

    await AtividadeSala.create({
      id_sala: novaSala.id_sala,
      id_restaurante: novaSala.id_restaurante,
      descricao: "Acabou de criar uma sala",
      status: 1,
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
            id_mesa: novaSala.id_mesa,
            id_usuario_convidado: convidado.id_usuario_convidado,
            id_restaurante: novaSala.id_restaurante,
            status_convidado: convidado.status_convidado,
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
            .replace("{{email}}", usuarioConvidado.email);

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
          console.log(
            "Mensagem enviada para o convidado: %s",
            infoConvite.messageId
          );
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

const editarNomeSala = async (req, res) => {
  const { id_sala } = req.params;
  const { nome_sala } = req.body;

  try {
    const sala = await Sala.findByPk(id_sala);
    if (!sala) {
      return res.status(404).json({ mensagem: "Sala não encontrada." });
    }

    await sala.update({ nome_sala });
    res
      .status(200)
      .json({ mensagem: "Nome da sala atualizado com sucesso.", sala });
  } catch (error) {
    console.error("Erro ao atualizar o nome da sala:", error);
    res.status(500).json({ mensagem: "Erro ao atualizar o nome da sala." });
  }
};

const criarSalaWithoutConvidados = async (req, res) => {
  try {
    const {
      nome_sala,
      id_restaurante,
      id_mesa,
      id_usuario_anfitriao,
      status_anfitriao,
    } = req.body;

    console.log(req.body);

    const anfitriao = await Usuario.findByPk(id_usuario_anfitriao, {
      attributes: ["id_user", "nome", "sobrenome", "email"],
    });

    if (!anfitriao) {
      return res.status(404).send({ mensagem: "Anfitrião não encontrado." });
    }

    const findTable = await Mesa.findOne({
      where: {
        id_mesa: id_mesa,
      },
    });

    const novaSala = await Sala.create({
      nome_sala,
      numero_mesa: findTable.numero,
      id_restaurante,
      id_mesa,
      id_usuario_anfitriao,
      status_anfitriao,
      status: "aberta",
    });

    await AtividadeSala.create({
      id_sala: novaSala.id_sala,
      id_restaurante: novaSala.id_restaurante,
      descricao: "Acabou de criar uma sala",
      status: 1,
    });

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
      success: true,
      mensagem: "Sala criada com sucesso!",
      sala: novaSala,
    });
  } catch (error) {
    console.error("Erro ao criar sala:", error);
    res.status(400).json({ error: error.message, success: false });
  }
};

// Função para criar um convidado
const convidado = async (req, res) => {
  try {
    const { id_mesa, id_usuario_convidado } = req.body;

    const sala = await Sala.findOne({
      where: {
        id_mesa: id_mesa,
        status_anfitriao: 1,
      },
    });

    if (sala) {
      // Criar o convidado associado à sala
      const convidadoQr = await SalaConvidado.create({
        id_sala: sala.id_sala,
        id_usuario_convidado: id_usuario_convidado,
        status_convidado: 0,
      });
      return res.status(200).json({
        mensagem: "Convidado criado com sucesso!",
        convidado: convidadoQr,
      });
    } else {
      return res.status(404).json({
        mensagem: "Nenhuma sala com anfitrião encontrada para esta mesa.",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erro ao procurar sala ou criar convidado." });
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
// Verificar se o usuário convidado já aceitou o convite
const verificarConvitesPendentes = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    // Procurar convites pendentes para o usuário
    const convitesPendentes = await SalaConvidado.findAll({
      where: {
        id_usuario_convidado: id_usuario,
        status_convidado: 0,
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
  const { status: status_convidado } = req.body;

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

    convite.status_convidado = status_convidado === "Aceito" ? 1 : 0;
    await convite.save();

    if (req.body.status === 1) {
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
    } else if (req.body.status === 0) {
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

const entrarSala = async (req, res) => {
  const { id_sala, id_usuario } = req.params;

  try {
    const sala = await Sala.findByPk(id_sala, {
      include: [
        { model: Usuario, as: "anfitriao" },
        { model: Usuario, as: "convidados" },
      ],
    });

    if (!sala) {
      return res.status(404).json({ mensagem: "Sala não encontrada." });
    }

    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    const convidado = await SalaConvidado.create({
      id_sala: sala.id_sala,
      numero_mesa: sala.numero_mesa,
      id_mesa: sala.id_mesa,
      status: "aceito",
      id_usuario_convidado: id_usuario,
      id_restaurante: sala.id_restaurante,
      status_convidado: 1,
    });

    await AtividadeSala.create({
      id_sala: sala.id_sala,
      id_restaurante: sala.id_restaurante,
      descricao: "Acabou de entrar na sala.",
      status: 1,
    });

    res.status(200).json({
      success: true,
      mensagem: "Você entrou na sala com sucesso!",
      convidado,
    });
  } catch (error) {
    console.error("Erro ao entrar na sala:", error);
    res.status(400).json({ error: error.message, success: false });
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
// Deleta a sala
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
      descricao: "Convivio terminado.",
      status: 1,
    });

    res
      .status(200)
      .json({ mensagem: "Sala e convidados deletados com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar sala:", error);
    res.status(400).json({ error: error.message });
  }
};

const criarSalaSemConvidado = async (req, res) => {
  try {
    const {
      nome_sala,
      id_restaurante,
      id_mesa,
      id_usuario_anfitriao,
      status_anfitriao,
    } = req.body;

    const anfitriao = await Usuario.findByPk(id_usuario_anfitriao, {
      attributes: ["id_user", "nome", "sobrenome"],
    });

    if (!anfitriao) {
      return res.status(404).json({ mensagem: "Anfitrião não encontrado." });
    }

    const mesa = await Mesa.findOne({
      where: { id_mesa: id_mesa },
    });

    if (!mesa) {
      return res.status(404).json({ mensagem: "Mesa não encontrada." });
    }

    const novaSala = await Sala.create({
      nome_sala,
      numero_mesa: mesa.numero,
      id_restaurante,
      id_mesa,
      id_usuario_anfitriao,
      status_anfitriao,
      status: "aberta",
    });

    await AtividadeSala.create({
      id_sala: novaSala.id_sala,
      id_restaurante: novaSala.id_restaurante,
      descricao: "Sala criada sem convidados",
      status: 1,
    });

    res.status(201).json({
      success: true,
      mensagem: "Sala criada com sucesso!",
      sala: novaSala,
    });
  } catch (error) {
    console.error("Erro ao criar sala:", error);
    res
      .status(500)
      .json({ mensagem: "Erro ao criar sala.", error: error.message });
  }
};

module.exports = {
  criarSala,
  convidado,
  verificaAnfitriao,
  listarSalas,
  obterSala,
  verificarConvitesPendentes,
  atualizarStatusConvite,
  deletarSala,
  criarSalaWithoutConvidados,
  entrarSala,
  criarSalaSemConvidado,
  editarNomeSala,
  getSalasPorUsuario,
  editarStatusSala
};
