
const CozinhaRestaurante = require('../models/tb_cozinha_restaurante');
const Restaurante = require('../models/tb_restaurante');

// Criar uma nova cozinha
const criarCozinha = async (req, res) => {
  try {
    const novaCozinha = await CozinhaRestaurante.create({
      nome_cozinha: req.body.nome_cozinha,
      id_restaurante: req.body.id_restaurante,
    });

    return res.status(201).send({
      mensagem: "Cozinha criada com sucesso!",
      cozinha: novaCozinha,
    });
  } catch (error) {
    console.error("Erro ao criar cozinha: ", error);
    return res.status(500).send({ mensagem: "Erro ao criar cozinha", error: error.message });
  }
};

// Buscar todas as cozinhas
const buscarTodasCozinhas = async (req, res) => {
  try {
    const cozinhas = await CozinhaRestaurante.findAll({
      include: [
        {
          model: Restaurante,
          as: "restaurante",
        },
      ],
    });

    if (!cozinhas || cozinhas.length === 0) {
      return res.status(404).send({ mensagem: "Nenhuma cozinha encontrada" });
    }

    return res.status(200).send(cozinhas);
  } catch (error) {
    console.error("Erro ao buscar cozinhas: ", error);
    return res.status(500).send({ mensagem: "Erro ao buscar cozinhas", error: error.message });
  }
};

// Buscar uma cozinha por ID
const buscarCozinhaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const cozinha = await CozinhaRestaurante.findOne({
      where: { id_cozinha_restaurante: id },
      include: [
        {
          model: Restaurante,
          as: "restaurante",
        },
      ],
    });

    if (!cozinha) {
      return res.status(404).send({ mensagem: "Cozinha não encontrada" });
    }

    return res.status(200).send(cozinha);
  } catch (error) {
    console.error("Erro ao buscar cozinha por ID: ", error);
    return res.status(500).send({ mensagem: "Erro ao buscar cozinha", error: error.message });
  }
};

const buscarCozinhasPorRestaurante = async (req, res) => {
  try {
    const { id_restaurante } = req.params;

    const cozinhas = await CozinhaRestaurante.findAll({
      where: { id_restaurante },
      include: [
        {
          model: Restaurante,
          as: "restaurante",
        },
      ],
    });

    if (cozinhas.length === 0) {
      return res.status(404).send({ mensagem: "Nenhuma cozinha encontrada para este restaurante" });
    }

    return res.status(200).send(cozinhas);
  } catch (error) {
    console.error("Erro ao buscar cozinhas por restaurante: ", error);
    return res.status(500).send({ mensagem: "Erro ao buscar cozinhas", error: error.message });
  }
};

// Atualizar uma cozinha
const atualizarCozinha = async (req, res) => {
  try {
    const { id } = req.params;

    const [rowsUpdated, [cozinhaAtualizada]] = await CozinhaRestaurante.update(
      {
        nome_cozinha: req.body.nome_cozinha,
        id_restaurante: req.body.id_restaurante,
      },
      {
        where: { id_cozinha_restaurante: id },
        returning: true,
      }
    );

    if (rowsUpdated === 0) {
      return res.status(404).send({ mensagem: "Cozinha não encontrada" });
    }

    return res.status(200).send({
      mensagem: "Cozinha atualizada com sucesso!",
      cozinha: cozinhaAtualizada,
    });
  } catch (error) {
    console.error("Erro ao atualizar cozinha: ", error);
    return res.status(500).send({ mensagem: "Erro ao atualizar cozinha", error: error.message });
  }
};

// Deletar uma cozinha
const deletarCozinha = async (req, res) => {
  try {
    const { id } = req.params;

    const rowsDeleted = await CozinhaRestaurante.destroy({
      where: { id_cozinha_restaurante: id },
    });

    if (rowsDeleted === 0) {
      return res.status(404).send({ mensagem: "Cozinha não encontrada" });
    }

    return res.status(200).send({ mensagem: "Cozinha deletada com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar cozinha: ", error);
    return res.status(500).send({ mensagem: "Erro ao deletar cozinha", error: error.message });
  }
};

module.exports = {
  criarCozinha,
  buscarTodasCozinhas,
  buscarCozinhasPorRestaurante,
  buscarCozinhaPorId,
  atualizarCozinha,
  deletarCozinha,
};
