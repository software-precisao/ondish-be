const AtividadeSala = require("../models/tb_atividades_sala");
const Restaurante = require("../models/tb_restaurante");
const Sala = require("../models/tb_sala");
const Usuario = require("../models/tb_usuarios");

const atividadeSalaController = {
  criarAtividadeSala: async (req, res) => {
    try {
      const novaAtividadeSala = await AtividadeSala.create({
        id_sala: req.body.id_sala,
        id_restaurante: req.body.id_restaurante,
        descricao: req.body.descricao,
        status: req.body.status,
      });

      return res.status(201).send({
        mensagem: "Atividade de sala criada com sucesso!",
        atividadeSalaCriada: novaAtividadeSala,
      });
    } catch (error) {
      console.error("Erro ao criar atividade de sala: ", error);
      return res
        .status(500)
        .send({ mensagem: "Erro ao criar atividade de sala", error: error.message });
    }
  },

  obterAtividadesSala: async (req, res) => {
    try {
      const atividadesSala = await AtividadeSala.findAll({
        include: [
          { model: Restaurante, as: "restaurante" },
          { model: Sala, as: "sala" },
        ],
      });

      if (!atividadesSala || atividadesSala.length === 0) {
        return res.status(404).send({
          mensagem: "Nenhuma atividade de sala encontrada.",
        });
      }

      return res.status(200).send(atividadesSala);
    } catch (error) {
      console.error("Erro ao obter atividades de sala: ", error);
      return res.status(500).send({ mensagem: "Erro ao obter atividades de sala", error: error.message });
    }
  },

  obterAtividadeSalaPorRestaurante: async (req, res) => {
    try {
      const { id_restaurante } = req.params;

      const atividadesSala = await AtividadeSala.findAll({
        where: { id_restaurante },
        include: [
          { model: Restaurante, as: "restaurante" },
          { model: Sala, as: "sala", include: [{ model: Usuario, as: "anfitriao" }] },
        ],
      });

      if (!atividadesSala || atividadesSala.length === 0) {
        return res.status(404).send({
          mensagem: "Nenhuma atividade de sala encontrada para este restaurante.",
        });
      }

      return res.status(200).send(atividadesSala);
    } catch (error) {
      console.error("Erro ao obter atividades de sala por restaurante: ", error);
      return res.status(500).send({ mensagem: "Erro ao obter atividades de sala por restaurante", error: error.message });
    }
  },

  atualizarAtividadeSala: async (req, res) => {
    try {
      const { id_atividade_sala } = req.params;

      const [updated] = await AtividadeSala.update(req.body, {
        where: { id_atividade_sala },
      });

      if (updated) {
        const atividadeSalaAtualizada = await AtividadeSala.findByPk(id_atividade_sala);
        return res.status(200).send({
          mensagem: "Atividade de sala atualizada com sucesso!",
          atividadeSalaAtualizada,
        });
      } else {
        return res.status(404).send({ mensagem: "Atividade de sala não encontrada." });
      }
    } catch (error) {
      console.error("Erro ao atualizar atividade de sala: ", error);
      return res.status(500).send({ mensagem: "Erro ao atualizar atividade de sala", error: error.message });
    }
  },

  deletarAtividadeSala: async (req, res) => {
    try {
      const { id_atividade_sala } = req.params;

      const atividadeSala = await AtividadeSala.findByPk(id_atividade_sala);
      if (!atividadeSala) {
        return res.status(404).send({ mensagem: "Atividade de sala não encontrada!" });
      }

      await AtividadeSala.destroy({ where: { id_atividade_sala } });

      return res.status(200).send({ mensagem: "Atividade de sala deletada com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar atividade de sala: ", error);
      return res.status(500).send({ mensagem: "Erro ao deletar atividade de sala", error: error.message });
    }
  }
};

module.exports = atividadeSalaController;