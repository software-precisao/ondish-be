const Pedido = require("../models/tb_pedido");
const ItensPedido = require("../models/tb_itens_pedido");
const ItensPedidoOpcoes = require("../models/tb_itens_pedido");
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
    const { id_sala, id_usuario, id_restaurante, status, id_mesa, itens } = req.body;

    const numero_pedido = gerarNumeroPedido();

    const pedido = await Pedido.create({
      id_sala,
      id_usuario,
      id_restaurante,
      status,
      id_mesa,
      valor_total: 0,
      numero_pedido,
    });

    let valor_total = 0;

    for (const item of itens) {
      const { id_prato, id_bebida, quantidade, instruction, opcoes } = item;
      let valor = 0;

      if (id_prato) {
        const prato = await Pratos.findByPk(id_prato);
        if (!prato) return res.status(404).send({ mensagem: "Prato não encontrado." });
        valor = prato.valor;
      }

      const parsedOpcoes = JSON.parse(opcoes);

      if (Array.isArray(parsedOpcoes)) {
        await Promise.all(
          parsedOpcoes.map(async (opcaoId) => {
            const opcao = await Opcoes.findByPk(opcaoId);
            if (opcao) {
              valor += parseFloat(opcao.valorAdicional);
            }
          })
        );
      }

      if (id_bebida) {
        const bebida = await Bebida.findByPk(id_bebida);
        if (!bebida) return res.status(404).send({ mensagem: "Bebida não encontrada." });
        valor = bebida.valor;
      }

      // Cria o item do pedido e aguarda sua criação completa
      const novoItem = await ItensPedido.create({
        id_pedido: pedido.id_pedido,
        id_prato,
        id_bebida,
        quantidade,
        valor: valor * quantidade,
        observacoes: instruction,
      });

      // Depois que o item do pedido foi criado, então cria as relações com as opções
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

      valor_total += novoItem.valor;
    }

    pedido.valor_total = valor_total;
    await pedido.save();

    return res.status(201).send({
      mensagem: "Pedido criado com sucesso!",
      pedido,
    });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
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
          include: ["mesa"],
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
      itens: pedido.itens_pedido,
      sala: pedido.sala,
      mesa: pedido.mesa,
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
};