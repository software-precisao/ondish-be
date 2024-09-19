const Restaurante = require("../models/tb_restaurante");
const LatLong = require("../models/tb_lat_long");
const Pratos = require("../models/tb_pratos");
const Fotos = require("../models/tb_foto_pratos");
const QRCode = require("qrcode");
const Qrcode = require("../models/tb_qrcode");

const Usuario = require("../models/tb_usuarios");
const Avaliacao = require("../models/tb_avaliacao");
const Mesa = require("../models/tb_mesa");

const restauranteController = {
  criarRestaurante: async (req, res) => {
    try {
      const filenamecapa = req.files.capa
        ? req.files.capa[0].filename
        : "default-capa.png";
      const filenamelogo = req.files.logo
        ? req.files.logo[0].filename
        : "default-logo.png";

      const novoRestaurante = await Restaurante.create({
        nif: req.body.nif,
        nome_restaurante: req.body.nome_restaurante,
        ibam: req.body.ibam,
        website: req.body.website,
        facebook: req.body.facebook,
        logo: `/logo/${filenamelogo}`,
        capa: `/capa/${filenamecapa}`,
        instagram: req.body.instagram,
        telefone1: req.body.telefone1,
        telefone2: req.body.telefone2,
        morada: req.body.morada,
        codigo_postal: req.body.codigo_postal,
        id_user: req.body.id_user,
      });

      const qrData = novoRestaurante.id_restaurante.toString();
      const qrCodeURL = await QRCode.toDataURL(qrData);

      await novoRestaurante.update({ qrcode: qrCodeURL });

      const novoQrcode = await Qrcode.create({
        qrcode: qrCodeURL,
        id_restaurante: novoRestaurante.id_restaurante,
        id_mesa: req.body.id_mesa, 
      });

      let id_user = req.body.id_user;

      const usuario = await Usuario.findByPk(id_user);
      if (!usuario) {
        return res.status(404).send({ mensagem: "Usuário não encontrado!" });
      }

      if (usuario.config !== 2) {
        return res
          .status(400)
          .send({ mensagem: "A configuração do usuário não é 2!" });
      }

      usuario.config = 1;
      await usuario.save();

      const response = {
        mensagem: "Restaurante cadastrado com sucesso!",
        restauranteCriado: {
          id_restaurante: novoRestaurante.id_restaurante,
          qrcode: novoQrcode.qrcode,
          request: {
            tipo: "GET",
          },
        },
      };

      return res.status(202).send(response);
    } catch (error) {
      console.error("Erro ao criar restaurante: ", error);
      return res
        .status(500)
        .send({ mensagem: "Erro ao criar restaurante", error: error.message });
    }
  },

  buscarTodos: async (req, res) => {
    try {
      const restaurantes = await Restaurante.findAll();
      return res.status(200).send(restaurantes);
    } catch (error) {
      console.error("Erro ao buscar restaurantes: ", error);
      return res.status(500).send({
        mensagem: "Erro ao buscar restaurantes",
        error: error.message,
      });
    }
  },

  buscarRestaurantePorId: async (req, res) => {
    try {
      const { id } = req.params;

      const restaurante = await Restaurante.findAll({
        where: { id_restaurante: id },
        include: [
          {
            model: Avaliacao,
            as: "avaliacoes",
          },
        ],
      });

      if (!restaurante) {
        return res.status(404).send({ mensagem: "Restaurante não encontrado" });
      }

      return res.status(200).send(restaurante);
    } catch (error) {
      console.error("Erro ao buscar restaurante por ID: ", error);
      return res.status(500).send({
        mensagem: "Erro ao buscar restaurante",
        error: error.message,
      });
    }
  },
  // Atualizar um Restaurante
  atualizarRestaurante: async (req, res) => {
    const { id } = req.params;
    try {
      const atualizado = await Restaurante.update(req.body, {
        where: { id_restaurante: id },
      });
      if (atualizado[0] > 0) {
        return res
          .status(200)
          .send({ mensagem: "Restaurante atualizado com sucesso" });
      }
      return res.status(404).send({ mensagem: "Restaurante não encontrado" });
    } catch (error) {
      console.error("Erro ao atualizar restaurante: ", error);
      return res.status(500).send({
        mensagem: "Erro ao atualizar restaurante",
        error: error.message,
      });
    }
  },

  // Deletar um Restaurante
  deletarRestaurante: async (req, res) => {
    const { id_restaurante } = req.params;
    try {
      await Qrcode.destroy({
        where: { id_restaurante: id_restaurante },
      });

      await Mesa.destroy({
        where: { id_restaurante: id_restaurante },
      });
      
      await Avaliacao.destroy({
        where: { id_restaurante: id_restaurante },
      });

      const deletado = await Restaurante.destroy({
        where: { id_restaurante: id_restaurante },
      });

      if (deletado) {
        return res
          .status(200)
          .send({ mensagem: "Restaurante deletado com sucesso" });
      }
      return res.status(404).send({ mensagem: "Restaurante não encontrado" });
    } catch (error) {
      console.error("Erro ao deletar restaurante: ", error);
      return res.status(500).send({
        mensagem: "Erro ao deletar restaurante",
        error: error.message,
      });
    }
  },
};

module.exports = restauranteController;
