const LogPedido = require("../models/tb_logs_pedidos");

const logPedidoController = {
  criarLog: async (id_pedido, mensagem) => {
    try {
      await LogPedido.create({
        id_pedido,
        mensagem,
      });
      console.log("Log criado com sucesso");
    } catch (error) {
      console.error("Erro ao criar log:", error.message);
    }
  },

  visualizarLogs: async (req, res) => {
    try {
      const logs = await LogPedido.findAll();
      return res.status(200).json(logs);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro ao buscar logs", error: error.message });
    }
  },

  visualizarLogsById: async (req, res) => {
    try {
      const { id_pedido } = req.params;

      const logs = await LogPedido.findAll({
        where: { id_pedido },
      });

      if (logs.length === 0) {
        return res
          .status(404)
          .json({ mensagem: "Nenhum log encontrado para este pedido." });
      }

      return res.status(200).json(logs);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro ao buscar logs", error: error.message });
    }
  },
};

module.exports = logPedidoController;
