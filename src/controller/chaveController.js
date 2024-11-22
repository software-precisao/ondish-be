const Chave = require("../models/tb_chave");

const getChaves = async (req, res) => {
  try {
    const chaves = await Chave.findAll();
    res.status(200).json(chaves);
  } catch (error) {
    console.error("Erro ao listar as chaves:", error.message);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const getChaveById = async (req, res) => {
  const { id } = req.params;
  try {
    const chave = await Chave.findByPk(id);
    if (!chave) {
      return res.status(404).json({ error: "Chave não encontrada." });
    }
    res.status(200).json(chave);
  } catch (error) {
    console.error("Erro ao buscar a chave:", error.message);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const createChave = async (req, res) => {
  const { prod } = req.body;

  if (prod !== undefined && typeof prod !== "boolean") {
    return res.status(400).json({ error: "O valor de 'prod' deve ser true ou false." });
  }

  try {
    const novaChave = await Chave.create({ prod });
    res.status(201).json({ message: "Chave criada com sucesso.", chave: novaChave });
  } catch (error) {
    console.error("Erro ao criar a chave:", error.message);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const updateChaveProd = async (req, res) => {
  const { id } = req.params;
  const { prod } = req.body;

  if (prod === undefined || typeof prod !== "boolean") {
    return res.status(400).json({ error: "O valor de 'prod' deve ser true ou false." });
  }

  try {
    const chave = await Chave.findByPk(id);
    if (!chave) {
      return res.status(404).json({ error: "Chave não encontrada." });
    }

    chave.prod = prod;
    await chave.save();

    res.status(200).json({ message: "'prod' atualizado com sucesso.", chave });
  } catch (error) {
    console.error("Erro ao atualizar 'prod' da chave:", error.message);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const deleteChave = async (req, res) => {
  const { id } = req.params;
  try {
    const chave = await Chave.findByPk(id);
    if (!chave) {
      return res.status(404).json({ error: "Chave não encontrada." });
    }

    await chave.destroy();
    res.status(200).json({ message: "Chave deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar a chave:", error.message);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

module.exports = {
  getChaves,
  getChaveById,
  createChave,
  updateChaveProd,
  deleteChave,
};
