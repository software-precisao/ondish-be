const AtividadePedido = require("../models/tb_atividade_pedido");
const Restaurante = require("../models/tb_restaurante");
const Pedido = require("../models/tb_pedido");

const atividadePedidoController = {
  criarAtividadePedido: async (req, res) => {
    try {
      const novaAtividadePedido = await AtividadePedido.create({
        id_pedido: req.body.id_pedido,
        id_restaurante: req.body.id_restaurante,
        descricao: req.body.descricao,
        status: req.body.status,
      });

      return res.status(201).send({
        mensagem: "Atividade de pedido criada com sucesso!",
        atividadePedidoCriada: novaAtividadePedido,
      });
    } catch (error) {
      console.error("Erro ao criar atividade de pedido: ", error);
      return res
        .status(500)
        .send({ mensagem: "Erro ao criar atividade de pedido", error: error.message });
    }
  },

  obterAtividadesPedido: async (req, res) => {
    try {
      const atividadesPedido = await AtividadePedido.findAll({
        include: [
          { model: Restaurante, as: "restaurante" },
          { model: Pedido, as: "pedido" },
        ],
      });

      if (!atividadesPedido || atividadesPedido.length === 0) {
        return res.status(404).send({
          mensagem: "Nenhuma atividade de pedido encontrada.",
        });
      }

      return res.status(200).send(atividadesPedido);
    } catch (error) {
      console.error("Erro ao obter atividades de pedido: ", error);
      return res.status(500).send({ mensagem: "Erro ao obter atividades de pedido", error: error.message });
    }
  },

  obterAtividadesPedidoPorRestaurante: async (req, res) => {
    try {
      const { id_restaurante } = req.params;

      const atividadesPedido = await AtividadePedido.findAll({
        where: { id_restaurante },
        include: [
          { model: Restaurante, as: "restaurante" },
          { model: Pedido, as: "pedido" },
        ],
      });

      if (!atividadesPedido || atividadesPedido.length === 0) {
        return res.status(404).send({
          mensagem: "Nenhuma atividade de pedido encontrada para este restaurante.",
        });
      }

      return res.status(200).send(atividadesPedido);
    } catch (error) {
      console.error("Erro ao obter atividades de pedido por restaurante: ", error);
      return res.status(500).send({ mensagem: "Erro ao obter atividades de pedido por restaurante", error: error.message });
    }
  },

  atualizarAtividadePedido: async (req, res) => {
    try {
      const { id_atividade_pedido } = req.params;

      const [updated] = await AtividadePedido.update(req.body, {
        where: { id_atividade_pedido },
      });

      if (updated) {
        const atividadePedidoAtualizada = await AtividadePedido.findByPk(id_atividade_pedido);
        return res.status(200).send({
          mensagem: "Atividade de pedido atualizada com sucesso!",
          atividadePedidoAtualizada,
        });
      } else {
        return res.status(404).send({ mensagem: "Atividade de pedido não encontrada." });
      }
    } catch (error) {
      console.error("Erro ao atualizar atividade de pedido: ", error);
      return res.status(500).send({ mensagem: "Erro ao atualizar atividade de pedido", error: error.message });
    }
  },

  deletarAtividadePedido: async (req, res) => {
    try {
      const { id_atividade_pedido } = req.params;

      const atividadePedido = await AtividadePedido.findByPk(id_atividade_pedido);
      if (!atividadePedido) {
        return res.status(404).send({ mensagem: "Atividade de pedido não encontrada!" });
      }

      await AtividadePedido.destroy({ where: { id_atividade_pedido } });

      return res.status(200).send({ mensagem: "Atividade de pedido deletada com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar atividade de pedido: ", error);
      return res.status(500).send({ mensagem: "Erro ao deletar atividade de pedido", error: error.message });
    }
  }
};

module.exports = atividadePedidoController;