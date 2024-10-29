const MetodoPagamento = require("../models/tb_cartao_pagamento");

const metodoPagamentoController = {
  criarMetodoPagamento: async (req, res) => {
    try {
      const { id_user, numero_cartao, data_validade, cvc } = req.body;

      // Validação do número do cartão (Algoritmo de Luhn)
      const luhnCheck = (num) => {
        let sum = 0;
        for (let i = 0; i < num.length; i++) {
          let intVal = parseInt(num[i]);
          if (i % 2 === num.length % 2) intVal *= 2;
          if (intVal > 9) intVal -= 9;
          sum += intVal;
        }
        return sum % 10 === 0;
      };

      if (!luhnCheck(numero_cartao)) {
        return res.status(400).send({ mensagem: "Número do cartão inválido." });
      }

      const [mes, ano] = data_validade.split("/");
      const validade = new Date(`20${ano}-${mes}-01`);
      if (validade < new Date()) {
        return res.status(400).send({ mensagem: "Cartão expirado." });
      }

      if (!/^\d{3,4}$/.test(cvc)) {
        return res.status(400).send({ mensagem: "CVC inválido." });
      }

      // Simulação de tokenização (substituição do número do cartão por um token seguro)
      const token = `tok_${Math.random().toString(36).substr(2, 10)}`;

      const novoMetodoPagamento = await MetodoPagamento.create({
        id_user,
        numero_cartao: token, // Armazena o token em vez do número do cartão
        data_validade,
        cvc,
        token,
      });

      return res.status(201).send({
        mensagem: "Método de pagamento adicionado com sucesso.",
        id_cartao: novoMetodoPagamento.id_metodo_pagamento,
      });
    } catch (error) {
      console.error("Erro ao adicionar método de pagamento: ", error);
      return res.status(500).send({
        mensagem: "Erro ao adicionar método de pagamento.",
        error: error.message,
      });
    }
  },

  getMetodoPagamentoByUserId: async (req, res) => {
    try {
      const { id_user } = req.params;
      const metodoPagamento = await MetodoPagamento.findOne({
        where: { id_user },
      });
      if (!metodoPagamento) {
        return res
          .status(404)
          .send({ mensagem: "Método de pagamento não encontrado." });
      }
      return res.status(200).send(metodoPagamento);
    } catch (error) {
      console.error("Erro ao buscar método de pagamento: ", error);
      return res
        .status(500)
        .send({ mensagem: "Erro ao buscar método de pagamento." });
    }
  },

  deleteMetodoPagamento: async (req, res) => {
    try {
      const { id_user } = req.params;
      const metodoPagamento = await MetodoPagamento.findOne({
        where: { id_user },
      });
      if (!metodoPagamento) {
        return res
          .status(404)
          .send({ mensagem: "Método de pagamento não encontrado." });
      }
      await metodoPagamento.destroy();
      return res
        .status(200)
        .send({ mensagem: "Método de pagamento excluído com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir método de pagamento: ", error);
      return res
        .status(500)
        .send({ mensagem: "Erro ao excluir método de pagamento." });
    }
  },
};

module.exports = metodoPagamentoController;
