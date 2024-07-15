const Pedido = require("../models/tb_pedido");
const ItensPedido = require("../models/tb_itens_pedido");
const ItensPedidoOpcoes = require("../models/tb_itens_pedido_opcoes");
const Restaurante = require("../models/tb_restaurante");
const Pratos = require("../models/tb_pratos");
const Opcoes = require("../models/tb_opcoes");
const Bebida = require("../models/tb_bebidas");
const Sala = require("../models/tb_sala");
const Mesa = require("../models/tb_mesa");
const Usuario = require("../models/tb_usuarios");

const gerarNumeroPedido = () => {
  return Math.floor(Math.random() * 90000) + 10000;
};

const criarPedidoComItens = async (req, res) => {
  try {
    const { id_sala, id_usuario, id_restaurante, status, id_mesa, valor_total, itens } = req.body;

    const numero_pedido = gerarNumeroPedido();

    const pedido = await Pedido.create({
      id_sala,
      id_usuario,
      id_restaurante,
      status,
      id_mesa,
      valor_total,
      numero_pedido,
    });

    for (const item of itens) {
      const { id_prato, id_bebida, quantidade, instruction, opcoes } = item;

      // Cria o item do pedido
      const novoItem = await ItensPedido.create({
        id_pedido: pedido.id_pedido,
        id_prato,
        id_bebida,
        quantidade,
        valor: item.valor, // Certifique-se de que o valor está sendo enviado no item
        observacoes: instruction,
      });

      // Cria as relações com as opções, se houver
      const parsedOpcoes = opcoes ? JSON.parse(opcoes) : [];
      if (Array.isArray(parsedOpcoes)) {
        await Promise.all(
          parsedOpcoes.map(async (opcaoId) => {
            await ItensPedidoOpcoes.create({
              id_item_pedido: novoItem.id_item_pedido,
              id_opcao: opcaoId,
            });
          })
        );
      }
    }

    return res.status(201).send({
      mensagem: "Pedido criado com sucesso!",
      pedido,
      valor_total: pedido.valor_total,
    });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return res.status(500).send({ error: error.message });
  }
};

const obterStatusPedido = async (req, res) => {
  try {
    const { id_pedido } = req.params;

    const pedido = await Pedido.findByPk(id_pedido, {
      attributes: ['status'] // Apenas obtenha o status do pedido
    });

    if (!pedido) {
      return res.status(404).send({ mensagem: "Pedido não encontrado." });
    }

    return res.status(200).send({ status: pedido.status });
  } catch (error) {
    console.error("Erro ao obter status do pedido:", error);
    return res.status(500).send({ error: error.message });
  }
};


const obterPedido = async (req, res) => {
  try {
    const { id_pedido } = req.params;

    const pedido = await Pedido.findByPk(id_pedido, {
      include: [
        {
          model: ItensPedido,
          as: "itens_pedido",
          include: ["prato", "bebida", { model: Opcoes, as: "opcoes" }],
        },
        {
          model: Sala,
          as: "sala",
          include: [
            {
              model: Mesa,
              as: "mesas",
            },
          ],
        },
        {
          model: Usuario,
          as: "usuario",
        },
        {
          model: Restaurante,
          as: "restaurante",
        },
        {
          model: Mesa,
          as: "mesa",
        },
      ],
    });

    if (!pedido) {
      return res.status(404).send({ mensagem: "Pedido não encontrado." });
    }

    const response = {
      pedido,
      status: pedido.status,
      itens: pedido.itens_pedido,
      sala: pedido.sala,
      mesas: pedido.sala?.mesas,
      usuario: pedido.usuario,
      valor_total: pedido.valor_total,
    };

    return res.status(200).send(response);
  } catch (error) {
    console.error("Erro ao obter pedido:", error);
    return res.status(500).send({ error: error.message });
  }
};

const atualizarStatusPedido = async (req, res) => {
  try {
    const { id_pedido, status } = req.body;

    const pedido = await Pedido.findByPk(id_pedido);
    if (!pedido) {
      return res.status(404).send({ mensagem: "Pedido não encontrado!" });
    }

    pedido.status = status;
    await pedido.save();

    return res.status(200).send({
      mensagem: "Status do pedido atualizado com sucesso!",
      pedidoAtualizado: {
        id_pedido: pedido.id_pedido,
        status: pedido.status,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);
    return res.status(500).send({ mensagem: "Erro ao atualizar status do pedido", error: error.message });
  }
};

module.exports = {
  criarPedidoComItens,
  obterPedido,
  atualizarStatusPedido,
  obterStatusPedido
};