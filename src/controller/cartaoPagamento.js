const MetodoPagamento = require("../models/tb_cartao_pagamento");
const jwt = require("jsonwebtoken");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const metodoPagamentoController = {
  criarMetodoPagamento: async (req, res) => {
    try {
      const { id_user, numero_cartao, data_validade, token } = req.body;

      // const luhnCheck = (num) => {
      //   let sum = 0;
      //   for (let i = 0; i < num.length; i++) {
      //     let intVal = parseInt(num[i]);
      //     if (i % 2 === num.length % 2) intVal *= 2;
      //     if (intVal > 9) intVal -= 9;
      //     sum += intVal;
      //   }
      //   return sum % 10 === 0;
      // };

      // if (!luhnCheck(numero_cartao)) {
      //   return res.status(400).send({ mensagem: "Número do cartão inválido." });
      // }

      const [mes, ano] = data_validade.split("/");
      const validade = new Date(`20${ano}-${mes}-01`);
      if (validade < new Date()) {
        return res.status(400).send({ mensagem: "Cartão expirado." });
      }

      // if (!/^\d{3,4}$/.test(cvc)) {
      //   return res.status(400).send({ mensagem: "CVC inválido." });
      // }

      const tokenCartao = jwt.sign({ numero_cartao }, process.env.JWT_KEY, {
        expiresIn: "6h",
      });

      const novoMetodoPagamento = await MetodoPagamento.create({
        id_user,
        numero_cartao: tokenCartao,
        data_validade,
        token,
      });

      return res.status(201).send({
        mensagem: "Método de pagamento adicionado com sucesso.",
        id_metodo_pagamento: novoMetodoPagamento.id_metodo_pagamento,
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
      const metodoPagamento = await MetodoPagamento.findAll({
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

  editarMetodoPagamento: async (req, res) => {
    try {
      const id_metodo_pagamento = req.params.id_metodo_pagamento;
      const { customerId, oldToken, numero_cartao, data_validade, token } =
        req.body;

      if (!oldToken || !token) {
        return res.status(400).json({
          error: "paymentMethodId e novoPaymentMethodId são obrigatórios.",
        });
      }

      console.log("ID do método de pagamento recebido:", id_metodo_pagamento);

      const metodoPagamento = await MetodoPagamento.findByPk(
        id_metodo_pagamento
      );
      if (!metodoPagamento) {
        return res
          .status(404)
          .send({ mensagem: "Método de pagamento não encontrado." });
      }

      // if (numero_cartao) {
      // const luhnCheck = (num) => {
      //   let sum = 0;
      //   for (let i = 0; i < num.length; i++) {
      //     let intVal = parseInt(num[i]);
      //     if (i % 2 === num.length % 2) intVal *= 2;
      //     if (intVal > 9) intVal -= 9;
      //     sum += intVal;
      //   }
      //   return sum % 10 === 0;
      // };

      // if (!luhnCheck(numero_cartao)) {
      //   return res
      //     .status(400)
      //     .send({ mensagem: "Número do cartão inválido." });
      // }

      const cliente = await stripe.customers.retrieve(customerId); // Aqui você recupera o cliente da Stripe

      if (!cliente) {
        return res.status(404).json({ error: "Cliente não encontrado." });
      }

      // Desanexa o método de pagamento antigo do cliente
      await stripe.paymentMethods.detach(oldToken);

      // Anexa o novo método de pagamento ao cliente
      await stripe.paymentMethods.attach(token, {
        customer: customerId, // O cliente ao qual o novo método será associado
      });

      const [mes, ano] = data_validade.split("/");
      const validade = new Date(`20${ano}-${mes}-01`);
      if (validade < new Date()) {
        return res.status(400).send({ mensagem: "Cartão expirado." });
      }

      // if (!/^\d{3,4}$/.test(cvc)) {
      //   return res.status(400).send({ mensagem: "CVC inválido." });
      // }

      const tokenCartao = jwt.sign({ numero_cartao }, process.env.JWT_KEY, {
        expiresIn: "6h",
      });

      await metodoPagamento.update({
        numero_cartao: tokenCartao,
        data_validade,
        token,
      });

      return res.status(200).send({
        mensagem: "Método de pagamento atualizado com sucesso.",
        id_metodo_pagamento,
      });

      // else {
      //   await metodoPagamento.update({
      //     data_validade,
      //     cvc,
      //   });

      //   return res.status(200).send({
      //     mensagem:
      //       "Método de pagamento atualizado com sucesso, sem alteração no número do cartão.",
      //     id_metodo_pagamento,
      //   });
      // }
    } catch (error) {
      console.error("Erro ao atualizar método de pagamento: ", error);
      return res.status(500).send({
        mensagem: "Erro ao atualizar método de pagamento.",
        error: error.message,
      });
    }
  },

  deleteMetodoPagamento: async (req, res) => {
    try {
      const { id_metodo_pagamento } = req.params;

      const { paymentMethodId } = req.body;

      console.log(paymentMethodId);

      const metodoPagamento = await MetodoPagamento.findOne({
        where: { id_metodo_pagamento },
      });

      if (!paymentMethodId) {
        return res
          .status(400)
          .json({ error: "paymentMethodId é obrigatório." });
      }

      if (!metodoPagamento) {
        return res
          .status(404)
          .send({ mensagem: "Método de pagamento não encontrado." });
      }

      const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);

      await metodoPagamento.destroy();

      if (paymentMethod) {
        return res
          .status(200)
          .json({ message: "Cartão removido com sucesso." });
      } else {
        return res
          .status(404)
          .json({ error: "Método de pagamento não encontrado." });
      }
    } catch (error) {
      console.error("Erro ao excluir método de pagamento: ", error);
      return res
        .status(500)
        .send({ mensagem: "Erro ao excluir método de pagamento." });
    }
  },

  definirCartaoPredefinido: async (req, res) => {
    try {
      const { id_metodo_pagamento } = req.params;
      const { id_user } = req.body;

      const metodoPagamento = await MetodoPagamento.findByPk(
        id_metodo_pagamento
      );
      if (!metodoPagamento) {
        return res
          .status(404)
          .send({ mensagem: "Método de pagamento não encontrado." });
      }

      await MetodoPagamento.update({ selected: false }, { where: { id_user } });

      await metodoPagamento.update({ selected: true });

      return res.status(200).send({
        mensagem: "Cartão definido como pré-definido com sucesso.",
        id_metodo_pagamento,
      });
    } catch (error) {
      console.error("Erro ao definir cartão como pré-definido: ", error);
      return res.status(500).send({
        mensagem: "Erro ao definir cartão como pré-definido.",
        error: error.message,
      });
    }
  },
};

module.exports = metodoPagamentoController;
