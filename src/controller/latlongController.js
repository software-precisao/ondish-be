const LatLong = require("../models/tb_lat_long");
const Usuario = require("../models/tb_usuarios");

const latLongController = {
  buscarTodasCoordenadas: async (req, res) => {
    try {
      const coordenadas = await LatLong.findAll({
        include: [Usuario],
      });
      return res.status(200).json(coordenadas);
    } catch (error) {
      console.error("Erro ao buscar coordenadas: ", error);
      return res
        .status(500)
        .send({ mensagem: "Erro ao buscar coordenadas", error: error.message });
    }
  },

  buscarCoordenadasPorId: async (req, res) => {
    try {
      const id = req.params.id;
      const coordenada = await LatLong.findByPk(id, {
        include: [Usuario],
      });
      if (!coordenada) {
        return res
          .status(404)
          .send({ mensagem: "Coordenadas não encontradas." });
      }
      return res.status(200).json(coordenada);
    } catch (error) {
      console.error("Erro ao buscar coordenadas por ID: ", error);
      return res.status(500).send({
        mensagem: "Erro ao buscar coordenadas por ID",
        error: error.message,
      });
    }
  },

  atualizarCoordenada: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        latitude,
        longitude,
        cep,
        endereco,
        andar,
        numero_porta,
        localizacao,
        descricao,
      } = req.body;
      const atualizado = await LatLong.update(
        {
          latitude,
          longitude,
          cep,
          endereco,
          andar,
          numero_porta,
          localizacao,
          descricao,
        },
        { where: { id_lat_long: id } }
      );
      if (atualizado[0]) {
        return res
          .status(200)
          .send({ mensagem: "Coordenada atualizada com sucesso" });
      } else {
        return res.status(404).send({ mensagem: "Coordenada não encontrada" });
      }
    } catch (error) {
      console.error("Erro ao atualizar coordenada: ", error);
      return res.status(500).send({
        mensagem: "Erro ao atualizar coordenada",
        error: error.message,
      });
    }
  },

  atualizarStatus: async (req, res) => {
    try {
      const { id } = req.params; // id_lat_long
      const { status, id_user } = req.body; // status (true/false), id_user

      // Atualizar todos os registros do mesmo id_user para status false
      if (status === true) {
        await LatLong.update({ status: false }, { where: { id_user } });
      }

      // Agora, atualizar o status do registro específico
      const atualizado = await LatLong.update(
        { status },
        { where: { id_lat_long: id, id_user } }
      );

      // Verificar se o registro foi encontrado e atualizado
      if (atualizado[0]) {
        return res
          .status(200)
          .send({ mensagem: "Status atualizado com sucesso" });
      } else {
        return res.status(404).send({ mensagem: "Coordenada não encontrada" });
      }
    } catch (error) {
      console.error("Erro ao atualizar status: ", error);
      return res
        .status(500)
        .send({ mensagem: "Erro ao atualizar status", error: error.message });
    }
  },

  adicionarCoordenadas: async (req, res) => {
    try {
      const {
        id_user,
        cep,
        endereco,
        latitude,
        longitude,
        andar,
        numero_porta,
        localizacao,
        descricao,
        status,
      } = req.body;
      const novaCoordenada = await LatLong.create({
        id_user,
        cep,
        endereco,
        latitude,
        longitude,
        andar,
        numero_porta,
        localizacao,
        descricao,
        status,
      });
      return res.status(201).json(novaCoordenada);
    } catch (error) {
      console.error("Erro ao adicionar coordenadas: ", error);
      return res.status(500).send({
        mensagem: "Erro ao adicionar coordenadas",
        error: error.message,
      });
    }
  },

  removerCoordenada: async (req, res) => {
    try {
      const { id } = req.params;
      const deletado = await LatLong.destroy({ where: { id_lat_long: id } });
      if (deletado) {
        return res
          .status(200)
          .send({ mensagem: "Coordenada removida com sucesso" });
      } else {
        return res.status(404).send({ mensagem: "Coordenada não encontrada" });
      }
    } catch (error) {
      console.error("Erro ao remover coordenada: ", error);
      return res
        .status(500)
        .send({ mensagem: "Erro ao remover coordenada", error: error.message });
    }
  },
};

module.exports = latLongController;
