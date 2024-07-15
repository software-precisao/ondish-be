const Avaliacao = require("../models/tb_avaliacao")
const Restaurante = require("../models/tb_restaurante")
const Usuario = require("../models/tb_usuarios")

// Criar uma nova avaliação
const criarAvaliacao = async (req, res) => {
  try {
    const { avaliacao, id_restaurante, id_user } = req.body;

    const novaAvaliacao = await Avaliacao.create({
      avaliacao,
      id_restaurante,
      id_user,
    });

    return res.status(201).send({
      mensagem: "Avaliação criada com sucesso!",
      avaliacao: novaAvaliacao,
    });
  } catch (error) {
    console.error("Erro ao criar avaliação: ", error);
    return res.status(500).send({ mensagem: "Erro ao criar avaliação", error: error.message });
  }
};

// Buscar todas as avaliações
const buscarTodasAvaliacoes = async (req, res) => {
  try {
    const avaliacoes = await Avaliacao.findAll({
      include: [
        {
          model: Restaurante,
          as: "restaurante",
        },
        {
          model: Usuario,
        },
      ],
    });

    if (!avaliacoes || avaliacoes.length === 0) {
      return res.status(404).send({ mensagem: "Nenhuma avaliação encontrada" });
    }

    return res.status(200).send(avaliacoes);
  } catch (error) {
    console.error("Erro ao buscar avaliações: ", error);
    return res.status(500).send({ mensagem: "Erro ao buscar avaliações", error: error.message });
  }
};

// Buscar uma avaliação por ID
const buscarAvaliacaoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const avaliacao = await Avaliacao.findOne({
      where: { id_avaliacao: id },
      include: [
        {
          model: Restaurante,
          as: "restaurante",
        },
        {
          model: Usuario,
        },
      ],
    });

    if (!avaliacao) {
      return res.status(404).send({ mensagem: "Avaliação não encontrada" });
    }

    return res.status(200).send(avaliacao);
  } catch (error) {
    console.error("Erro ao buscar avaliação por ID: ", error);
    return res.status(500).send({ mensagem: "Erro ao buscar avaliação", error: error.message });
  }
};

// Atualizar uma avaliação
const atualizarAvaliacao = async (req, res) => {
  try {
    const { id } = req.params;
    const { avaliacao } = req.body;

    const avaliacaoAtualizada = await Avaliacao.update(
      { avaliacao },
      {
        where: { id_avaliacao: id },
        returning: true,
      }
    );

    if (avaliacaoAtualizada[0] === 0) {
      return res.status(404).send({ mensagem: "Avaliação não encontrada" });
    }

    return res.status(200).send({
      mensagem: "Avaliação atualizada com sucesso!",
      avaliacao: avaliacaoAtualizada[1][0],
    });
  } catch (error) {
    console.error("Erro ao atualizar avaliação: ", error);
    return res.status(500).send({ mensagem: "Erro ao atualizar avaliação", error: error.message });
  }
};

const deletarAvaliacao = async (req, res) => {
  try {
    const { id } = req.params;

    const rowsDeleted = await Avaliacao.destroy({
      where: { id_avaliacao: id },
    });

    if (rowsDeleted === 0) {
      return res.status(404).send({ mensagem: "Avaliação não encontrada" });
    }

    return res.status(200).send({ mensagem: "Avaliação deletada com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar avaliação: ", error);
    return res.status(500).send({ mensagem: "Erro ao deletar avaliação", error: error.message });
  }
};

module.exports = {
  criarAvaliacao,
  buscarTodasAvaliacoes,
  buscarAvaliacaoPorId,
  atualizarAvaliacao,
  deletarAvaliacao,
};
