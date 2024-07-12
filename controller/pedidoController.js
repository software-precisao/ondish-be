const { Pedido, PedidoItem } = require("../models/tb_pedido");
const Pratos = require("../models/tb_pratos");
const Opcoes = require("../models/tb_opcoes");
const Bebida = require("../models/tb_bebidas");

// Função para criar um novo pedido
const criarPedido = async (req, res) => {
  try {
    const { id_sala, id_usuario, numero_pedido, status } = req.body;

    // Criar o pedido
    const pedido = await Pedido.create({
      id_sala,
      id_usuario,
      numero_pedido,
      status,
      total: 0
    });

    return res.status(201).send({
      mensagem: "Pedido criado com sucesso!",
      pedido
    });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return res.status(500).send({ error: error.message });
  }
};

// Função para adicionar item ao pedido
const adicionarItemPedido = async (req, res) => {
  try {
    const { id_pedido, id_prato, id_opcao, id_bebida, quantidade } = req.body;

    let valor = 0;

    if (id_prato) {
      const prato = await Pratos.findByPk(id_prato);
      if (!prato) return res.status(404).send({ mensagem: "Prato não encontrado." });
      valor = prato.valor;
    }

    if (id_opcao) {
      const opcao = await Opcoes.findByPk(id_opcao);
      if (!opcao) return res.status(404).send({ mensagem: "Opção não encontrada." });
      valor = opcao.valorAdicional;
    }

    if (id_bebida) {
      const bebida = await Bebida.findByPk(id_bebida);
      if (!bebida) return res.status(404).send({ mensagem: "Bebida não encontrada." });
      valor = bebida.valor;
    }

    const item = await PedidoItem.create({
      id_pedido,
      id_prato,
      id_opcao,
      id_bebida,
      quantidade,
      valor: valor * quantidade
    });

    // Atualizar o total do pedido
    const pedido = await Pedido.findByPk(id_pedido);
    pedido.total += item.valor;
    await pedido.save();

    return res.status(201).send({
      mensagem: "Item adicionado ao pedido com sucesso!",
      item
    });
  } catch (error) {
    console.error("Erro ao adicionar item ao pedido:", error);
    return res.status(500).send({ error: error.message });
  }
};

// Função para obter o pedido e itens do pedido
const obterPedido = async (req, res) => {
  try {
    const { id_pedido } = req.params;

    const pedido = await Pedido.findByPk(id_pedido, {
      include: [
        { model: PedidoItem, as: 'itens', include: ['prato', 'opcao', 'bebida'] }
      ]
    });

    if (!pedido) {
      return res.status(404).send({ mensagem: "Pedido não encontrado." });
    }

    return res.status(200).send({
      mensagem: "Pedido encontrado com sucesso!",
      pedido
    });
  } catch (error) {
    console.error("Erro ao obter pedido:", error);
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  criarPedido,
  adicionarItemPedido,
  obterPedido
};