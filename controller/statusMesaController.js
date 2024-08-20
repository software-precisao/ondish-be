const StatusMesa = require("../models/tb_status_mesa");

const criarStatusMesa = async (req, res) => {
  const { status } = req.body;
  try {
    const novoStatus = await StatusMesa.create({ status });
    res.status(201).json(novoStatus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const atualizarStatusMesa = async (req, res) => {
  const { id_mesa } = req.params;
  const { id_status_mesa } = req.body; 

  try {
    const mesa = await Mesa.findByPk(id_mesa);
    if (!mesa) {
      return res.status(404).json({ error: "Mesa não encontrada" });
    }

    mesa.id_status_mesa = id_status_mesa;
    await mesa.save();

    res.status(200).json({ mensagem: "Status da mesa atualizado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletarStatusMesa = async (req, res) => {
  const { id_status_mesa } = req.params;

  try {
    const statusMesa = await StatusMesa.findByPk(id_status_mesa);
    if (!statusMesa) {
      return res.status(404).json({ error: "Status da mesa não encontrado" });
    }

    await statusMesa.destroy();
    res.status(200).json({ mensagem: "Status da mesa deletado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const obterTodosStatusMesa = async (req, res) => {
  try {
    const statusMesas = await StatusMesa.findAll();
    res.status(200).json(statusMesas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const obterStatusMesaPorId = async (req, res) => {
  const { id_status_mesa } = req.params;

  try {
    const statusMesa = await StatusMesa.findByPk(id_status_mesa);
    if (!statusMesa) {
      return res.status(404).json({ error: "Status da mesa não encontrado" });
    }

    res.status(200).json(statusMesa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  criarStatusMesa,
  atualizarStatusMesa,
  deletarStatusMesa,
  obterTodosStatusMesa,
  obterStatusMesaPorId,
};
