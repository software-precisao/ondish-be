const Mesa = require("../models/tb_mesa");
const Restaurante = require("../models/tb_restaurante");

// Create (POST)
const criarMesa = async (req, res) => {
  const { numero, capacidade, id_restaurante, localizacao } = req.body;
  try {
    // Verificar se o número da mesa já existe para o restaurante
    const mesaExistente = await Mesa.findOne({
      where: {
        numero: numero,
        id_restaurante: id_restaurante
      }
    });

    if (mesaExistente) {
      return res.status(400).json({ mensagem: "Número da mesa já existe para este restaurante." });
    }

    // Criar a nova mesa
    const novaMesa = await Mesa.create({
      numero,
      capacidade,
      localizacao,
      id_restaurante
    });

    res.status(201).json(novaMesa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Read (GET all)
const listarMesas = async (req, res) => {
  try {
    const mesas = await Mesa.findAll({
      include: [{ model: Restaurante, as: "restaurante" }],
    });
    res.status(200).json(mesas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read (GET by ID)
const obterMesa = async (req, res) => {
  const { id } = req.params;
  try {
    const mesa = await Mesa.findByPk(id, {
      include: [{ model: Restaurante, as: "restaurante" }],
    });
    if (mesa) {
      res.status(200).json(mesa);
    } else {
      res.status(404).json({ error: "Mesa não encontrada" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const obterMesasPorRestaurante = async (req, res) => {
  const { id_restaurante } = req.params;
  try {
    const mesas = await Mesa.findAll({
      where: { id_restaurante },
      include: [{ model: Restaurante, as: "restaurante" }],
    });
    if (mesas.length > 0) {
      res.status(200).json(mesas);
    } else {
      res
        .status(404)
        .json({ error: "Nenhuma mesa encontrada para este restaurante" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update (PUT)
const atualizarMesa = async (req, res) => {
  const { id } = req.params;
  const { numero, capacidade, id_restaurante } = req.body;
  try {
    const mesa = await Mesa.findByPk(id);
    if (mesa) {
      mesa.numero = numero;
      mesa.capacidade = capacidade;
      mesa.id_restaurante = id_restaurante;
      await mesa.save();
      res.status(200).json(mesa);
    } else {
      res.status(404).json({ error: "Mesa não encontrada" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete (DELETE)
const deletarMesa = async (req, res) => {
  const { id } = req.params;
  try {
    const mesa = await Mesa.findByPk(id);
    if (mesa) {
      await mesa.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Mesa não encontrada" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  criarMesa,
  obterMesasPorRestaurante,
  listarMesas,
  obterMesa,
  atualizarMesa,
  deletarMesa,
};
