const LatLong = require('../models/tb_lat_long');
const Usuario = require('../models/tb_usuarios');
const Restaurante = require('../models/tb_restaurante');

const latLongController = {
 
  buscarTodasCoordenadas: async (req, res) => {
    try {
      const coordenadas = await LatLong.findAll({
        include: [Usuario, Restaurante]
      });
      return res.status(200).json(coordenadas);
    } catch (error) {
      console.error("Erro ao buscar coordenadas: ", error);
      return res.status(500).send({ mensagem: "Erro ao buscar coordenadas", error: error.message });
    }
  },
  buscarCoordenadasPorId: async (req, res) => {
    try {
      const id = req.params.id;
      const coordenada = await LatLong.findByPk(id, {
        include: [Usuario, Restaurante]
      });
      if (!coordenada) {
        return res.status(404).send({ mensagem: "Coordenadas não encontradas." });
      }
      return res.status(200).json(coordenada);
    } catch (error) {
      console.error("Erro ao buscar coordenadas por ID: ", error);
      return res.status(500).send({ mensagem: "Erro ao buscar coordenadas por ID", error: error.message });
    }
  },
  atualizarCoordenada: async (req, res) => {
    try {
      const { id } = req.params;
      const { latitude, longitude } = req.body;
      const atualizado = await LatLong.update({ latitude, longitude }, { where: { id_lat_long: id } });
      if (atualizado[0]) {
        return res.status(200).send({ mensagem: "Coordenada atualizada com sucesso" });
      } else {
        return res.status(404).send({ mensagem: "Coordenada não encontrada" });
      }
    } catch (error) {
      console.error("Erro ao atualizar coordenada: ", error);
      return res.status(500).send({ mensagem: "Erro ao atualizar coordenada", error: error.message });
    }
  },
  adicionarCoordenadas: async (req, res) => {
    try {
      const { id_user, id_restaurante, latitude, longitude } = req.body;
      const novaCoordenada = await LatLong.create({
        id_user,
        id_restaurante,
        latitude,
        longitude
      });
      return res.status(201).json(novaCoordenada);
    } catch (error) {
      console.error("Erro ao adicionar coordenadas: ", error);
      return res.status(500).send({ mensagem: "Erro ao adicionar coordenadas", error: error.message });
    }
  },
  removerCoordenada: async (req, res) => {
    try {
      const { id } = req.params;
      const deletado = await LatLong.destroy({ where: { id_lat_long: id } });
      if (deletado) {
        return res.status(200).send({ mensagem: "Coordenada removida com sucesso" });
      } else {
        return res.status(404).send({ mensagem: "Coordenada não encontrada" });
      }
    } catch (error) {
      console.error("Erro ao remover coordenada: ", error);
      return res.status(500).send({ mensagem: "Erro ao remover coordenada", error: error.message });
    }
  },
};

module.exports = latLongController;
