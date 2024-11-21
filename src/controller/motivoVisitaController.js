const MotivoVisita = require("../models/tb_motivo_visita");
const Mesa = require("../models/tb_mesa");

const createMotivoVisita = async (req, res) => {
  try {
    const { id_mesa, motivo_visita } = req.body;

    const mesa = await Mesa.findByPk(id_mesa);
    if (!mesa) {
      return res.status(404).json({ error: "Mesa não encontrada." });
    }

    if (!motivo_visita || motivo_visita.length > 255) {
      return res.status(400).json({ error: "Motivo da visita inválido." });
    }

    const novoMotivo = await MotivoVisita.create({ id_mesa, motivo_visita });
    return res.status(201).json(novoMotivo);
  } catch (error) {
    console.error("Erro ao criar motivo da visita:", error.message);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const getMotivoVisitaByMesa = async (req, res) => {
  try {
    const { id_mesa } = req.params;

    const motivos = await MotivoVisita.findAll({ where: { id_mesa } });
    if (motivos.length === 0) {
      return res
        .status(404)
        .json({ error: "Nenhum motivo encontrado para esta mesa." });
    }

    res.status(200).json(motivos);
  } catch (error) {
    console.error("Erro ao buscar motivos da visita:", error.message);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const updateMotivoVisita = async (req, res) => {
  try {
    const { id } = req.params; // ID do motivo da visita
    const { motivo_visita } = req.body;

    // Validação do motivo da visita
    if (!motivo_visita || motivo_visita.length > 255) {
      return res.status(400).json({ error: "Motivo da visita inválido." });
    }

    // Buscar o motivo existente
    const motivo = await MotivoVisita.findByPk(id);
    if (!motivo) {
      return res
        .status(404)
        .json({ error: "Motivo da visita não encontrado." });
    }

    // Atualizar o motivo da visita
    motivo.motivo_visita = motivo_visita;
    await motivo.save();

    res.status(200).json(motivo);
  } catch (error) {
    console.error("Erro ao atualizar motivo da visita:", error.message);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const deleteMotivoVisita = async (req, res) => {
  try {
    const { id } = req.params; // ID do motivo da visita

    // Verificar se o motivo existe
    const motivo = await MotivoVisita.findByPk(id);
    if (!motivo) {
      return res
        .status(404)
        .json({ error: "Motivo da visita não encontrado." });
    }

    // Excluir o registro
    await motivo.destroy();

    res.status(200).json({ message: "Motivo da visita excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir motivo da visita:", error.message);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

module.exports = {
  createMotivoVisita,
  getMotivoVisitaByMesa,
  updateMotivoVisita,
  deleteMotivoVisita,
};
