const ChamadoGarcom = require("../models/tb_garcom");
const Usuario = require("../models/tb_usuarios");
const Mesa = require("../models/tb_mesa");
const Restaurante = require("../models/tb_restaurante");

const chamarGarcom = async (req, res) => {
  const { id_user, id_mesa, id_restaurante } = req.body;

  try {
    const usuarioExistente = await Usuario.findByPk(id_user);
    if (!usuarioExistente) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado com o id fornecido.",
      });
    }

    const mesaExistente = await Mesa.findByPk(id_mesa);
    if (!mesaExistente) {
      return res.status(404).json({
        mensagem: "Mesa não encontrada com o id fornecido.",
      });
    }

    const restauranteExistente = await Restaurante.findByPk(id_restaurante);
    if (!restauranteExistente) {
      return res.status(404).json({
        mensagem: "Restaurante não encontrado com o id fornecido.",
      });
    }

    const novoChamado = await ChamadoGarcom.create({
      id_user,
      id_mesa,
      id_restaurante,
    });

    res.status(201).json({
      mensagem: "Chamado enviado para o garçom com sucesso.",
      chamado: novoChamado,
    });
  } catch (error) {
    console.error("Erro ao chamar o garçom:", error);
    res
      .status(500)
      .json({ mensagem: "Erro ao enviar o chamado para o garçom." });
  }
};

const atualizarStatusChamado = async (req, res) => {
  const { id_chamado } = req.params;
  const { status, id_user, id_mesa, id_restaurante } = req.body;

  try {
    const usuarioExistente = await Usuario.findByPk(id_user);
    if (!usuarioExistente) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado com o id fornecido.",
      });
    }

    const mesaExistente = await Mesa.findByPk(id_mesa);
    if (!mesaExistente) {
      return res.status(404).json({
        mensagem: "Mesa não encontrada com o id fornecido.",
      });
    }

    const restauranteExistente = await Restaurante.findByPk(id_restaurante);
    if (!restauranteExistente) {
      return res.status(404).json({
        mensagem: "Restaurante não encontrado com o id fornecido.",
      });
    }

    const chamado = await ChamadoGarcom.findByPk(id_chamado);
    if (!chamado) {
      return res.status(404).json({ mensagem: "Chamado não encontrado." });
    }

    await chamado.update({ status });
    res
      .status(200)
      .json({ mensagem: "Status do chamado atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar status do chamado:", error);
    res
      .status(500)
      .json({ mensagem: "Erro ao atualizar o status do chamado." });
  }
};

const editarStatusChamado = async (req, res) => {
  const { id_chamado } = req.params;
  const { status } = req.body;

  try {
    const chamado = await ChamadoGarcom.findByPk(id_chamado);
    if (!chamado) {
      return res.status(404).json({ mensagem: "Chamado não encontrado." });
    }

    await chamado.update({ status });
    res
      .status(200)
      .json({ mensagem: "Status do chamado editado com sucesso." });
  } catch (error) {
    console.error("Erro ao editar status do chamado:", error);
    res.status(500).json({ mensagem: "Erro ao editar o status do chamado." });
  }
};

const listarChamados = async (req, res) => {
  const { id_restaurante, id_mesa, id_user } = req.body;

  try {
    const whereClause = {};
    if (id_restaurante) whereClause.id_restaurante = id_restaurante;
    if (id_mesa) whereClause.id_mesa = id_mesa;
    if (id_user) whereClause.id_user = id_user;

    const chamados = await ChamadoGarcom.findAll({
      where: whereClause,
      include: [
        {
          model: Usuario,
          as: "usuario",
        },
        { model: Mesa, as: "mesa" },
        {
          model: Restaurante,
          as: "restaurante",
        },
      ],
    });

    res.status(200).json(chamados);
  } catch (error) {
    console.error("Erro ao listar chamados:", error);
    res.status(500).json({ mensagem: "Erro ao buscar chamados." });
  }
};

const buscarChamadosPorMesa = async (req, res) => {
  const { id_mesa } = req.params;

  try {
    const chamados = await ChamadoGarcom.findAll({
      where: { id_mesa },
    });

    if (chamados.length === 0) {
      return res
        .status(404)
        .json({ mensagem: "Nenhum chamado encontrado para esta mesa." });
    }

    res.status(200).json({ chamados });
  } catch (error) {
    console.error("Erro ao buscar chamados por mesa:", error);
    res.status(500).json({ mensagem: "Erro ao buscar chamados por mesa." });
  }
};

const buscarChamadosPorRestaurante = async (req, res) => {
  const { id_restaurante } = req.params;

  try {
    const chamados = await ChamadoGarcom.findAll({
      where: { id_restaurante },
    });

    if (chamados.length === 0) {
      return res
        .status(404)
        .json({ mensagem: "Nenhum chamado encontrado para este restaurante." });
    }

    res.status(200).json({ chamados });
  } catch (error) {
    console.error("Erro ao buscar chamados por restaurante:", error);
    res
      .status(500)
      .json({ mensagem: "Erro ao buscar chamados por restaurante." });
  }
};

const excluirChamado = async (req, res) => {
  const { id_chamado } = req.params;

  try {
    const chamado = await ChamadoGarcom.findByPk(id_chamado);

    if (!chamado) {
      return res.status(404).json({ mensagem: "Chamado não encontrado." });
    }

    await chamado.destroy();
    res.status(200).json({ mensagem: "Chamado excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir chamado:", error);
    res.status(500).json({ mensagem: "Erro ao excluir o chamado." });
  }
};

module.exports = {
  chamarGarcom,
  atualizarStatusChamado,
  editarStatusChamado,
  listarChamados,
  buscarChamadosPorMesa,
  buscarChamadosPorRestaurante,
  excluirChamado,
};
