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
const AtividadePedido = require("../models/tb_atividade_pedido");
const Sobremesa = require("../models/tb_sobremesas")
const logPedido = require("./logsPedidoController"); 
const { Op } = require("sequelize");


const gerarNumeroPedido = () => {
  return Math.floor(Math.random() * 90000) + 10000;
};

const obterTodosPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        {
          model: ItensPedido,
          as: "itens_pedido",
          include: [
            {
              model: Pratos,
              as: "prato",
            },
            {
              model: Bebida,
              as: "bebida",
            },
            {
              model: Opcoes,
              as: "opcoes",
            },
            {
              model: Sobremesa,
              as: "sobremesa",
            },
          ],
        },
        {
          model: Sala,
          as: "sala",
        },
        {
          model: Usuario,
          as: "usuario",
        },
        {
          model: Restaurante,
          as: "restaurante",
        },
      ],
    });

    if (!pedidos || pedidos.length === 0) {
      return res.status(404).send({ mensagem: "Nenhum pedido encontrado." });
    }

    return res.status(200).send(pedidos);
  } catch (error) {
    console.error("Erro ao obter pedidos:", error);
    return res.status(500).send({ error: error.message });
  }
};

const criarPedidoComItens = async (req, res) => {
  try {
    const {
      id_sala,
      id_usuario,
      id_restaurante,
      status,
      id_mesa,
      valor_total,
      itens,
    } = req.body;

    await Mesa.update(
      { id_status_mesa: 2 },
      { where: { id_mesa } }
    );

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
      const { id_prato, id_bebida, id_sobremesa, quantidade, instruction, opcoes } = item;

      const novoItem = await ItensPedido.create({
        id_pedido: pedido.id_pedido,
        id_prato,
        id_bebida,
        id_sobremesa, 
        quantidade,
        valor: item.valor,
        observacoes: instruction,
      });

      await AtividadePedido.create({
        id_pedido: pedido.id_pedido,
        id_restaurante: pedido.id_restaurante,
        descricao: " Um novo Pedido feito,",
        status: 1,
      });

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

    const mensagem = `Foi realizado um pedido com o n°: ${numero_pedido}, com o valor: ${valor_total} na mesa: ${id_mesa}, com o status: ${status}, às: ${pedido.createdAt}`;
    console.log(mensagem)
    await logPedido.criarLog(pedido.id_pedido, mensagem);

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
      attributes: ["status"], // Apenas obtenha o status do pedido
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
          include: [
            {
              model: Pratos,
              as: "prato",
            },
            {
              model: Bebida,
              as: "bebida",
            },
            {
              model: Opcoes,
              as: "opcoes",
            },
          ],
        },
        {
          model: Sala,
          as: "sala",
        },
        {
          model: Usuario,
          as: "usuario",
        },
        {
          model: Restaurante,
          as: "restaurante",
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

const obterPedidoRestaurante = async (req, res) => {
  try {
    const { id_restaurante } = req.params;

    const pedidos = await Pedido.findAll({
      where: { id_restaurante },
      include: [
        {
          model: ItensPedido,
          as: "itens_pedido",
          include: [
            {
              model: Pratos,
              as: "prato",
            },
            {
              model: Bebida,
              as: "bebida",
            },
            {
              model: Opcoes,
              as: "opcoes",
            },
            {
              model: Sobremesa,
              as: "sobremesa",
            },
          ],
        },
        {
          model: Sala,
          as: "sala",
        },
        {
          model: Usuario,
          as: "usuario",
        },
        {
          model: Restaurante,
          as: "restaurante",
        },
       
      ],
    });

    if (!pedidos || pedidos.length === 0) {
      return res.status(404).send({ mensagem: "Pedido não encontrado." });
    }

    return res.status(200).send(pedidos);
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

    if (status === "Pago" || "Cancelado") {
      await Mesa.update(
        { id_status_mesa: 1 },
        { where: { id_mesa: pedido.id_mesa } }
      );
    }

    const mensagem = `O status do pedido n°: ${pedido.numero_pedido} foi atualizado para: ${status} às ${pedido.updatedAt}`;
    await logPedido.criarLog(pedido.id_pedido, mensagem);

    return res.status(200).send({
      mensagem: "Status do pedido atualizado com sucesso!",
      pedidoAtualizado: {
        id_pedido: pedido.id_pedido,
        status: pedido.status,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);
    return res.status(500).send({
      mensagem: "Erro ao atualizar status do pedido",
      error: error.message,
    });
  }
};

const obterPedidoPorUsuarioMesa = async (req, res) => {

  try{

    const { id_usuario, id_mesa } = req.params;

    if(!id_usuario || !id_mesa){
      return res.status(400).send({mensagem: "Parâmetros inválidos"});
    }

    const pedido = await Pedido.findAll({
      where: {
        id_usuario,
        id_mesa: id_mesa,
        status: "Entregue na mesa"
    },
      include: [
        {
          model: ItensPedido,
          as: "itens_pedido",
          include: [
            {
              model: Pratos,
              as: "prato",
            },
            {
              model: Bebida,
              as: "bebida",
            },
            {
              model: Opcoes,
              as: "opcoes",
            },
            {
              model: Sobremesa,
              as: "sobremesa",
            },
          ],
        },]
        
  })

  if(!pedido){
    return res.status(404).send({mensagem: "Pedido não encontrado"});
  }

  let total = pedido.reduce((acc, item) => acc + parseFloat(item.valor_total), 0);


  return res.status(200).json({
    success: true,
    total_pedido: total ?? 0,
    pedidos: pedido
  })
  }
  catch(error){
    console.error("Erro ao obter pedido:", error.message);
    return res.status(500).send({ error: error.message });
  }

  
}

const obterPedidoNaoPagos = async (req, res) => {

  try{

    const { id_user, id_mesa } = req.params;

    if(!id_user){
      return res.status(400).send({mensagem: "Parâmetros inválidos"});
    }

    const mesa = await Mesa.findOne({
      where: {
        id_mesa
      }
    })

    const pedido = await Pedido.findAll({
      where: {
        id_usuario: id_user,
        id_mesa: id_mesa,
        status: {
          [Op.ne]: "Pago",
          [Op.ne]: "Cancelado"
        }},
      include: [
        {
          model: ItensPedido,
          as: "itens_pedido",
          include: [
            {
              model: Pratos,
              as: "prato",
            },
            {
              model: Bebida,
              as: "bebida",
            },
            {
              model: Opcoes,
              as: "opcoes",
            },
            {
              model: Sobremesa,
              as: "sobremesa",
            },
          ],
        },]}
      )


    
  if(!pedido){
    return res.status(404).send({mensagem: "Pedido não encontrado"});
  }

  const total = pedido.reduce((acc, item) => acc + parseFloat(item.valor_total), 0);

  return res.status(200).json({
    success: true,
    pedidos: pedido,
    total_pedido: total ?? 0,
    mesa: mesa
  })
   

  }
  catch(error){
    console.error("Erro ao obter pedido:", error.message);
    return res.status(500).send({ error: error.message });
  }

}


module.exports = {
  criarPedidoComItens,
  obterPedidoRestaurante,
  obterPedido,
  atualizarStatusPedido,
  obterStatusPedido,
  obterPedidoPorUsuarioMesa,
  obterPedidoNaoPagos,
  obterTodosPedidos
};
