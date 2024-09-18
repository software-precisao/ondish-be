const Mesa = require("../models/tb_mesa");
const Restaurante = require("../models/tb_restaurante");
const StatusMesa = require("../models/tb_status_mesa");
const QRCode = require("qrcode");
const Qrcode = require("../models/tb_qrcode");

const criarMesa = async (req, res) => {
  const { numero, capacidade, id_restaurante, localizacao } = req.body;
  try {
    const novaMesa = await Mesa.create({
      numero,
      capacidade,
      localizacao,
      id_restaurante,
      id_status_mesa: 1,
    });

    const qrData = `${novaMesa.id_restaurante}|${novaMesa.id_mesa}`;
    const qrCodeURL = await QRCode.toDataURL(qrData);

    await novaMesa.update({ qrcode: qrCodeURL });

    const novoQrcode = await Qrcode.create({
      qrcode: qrCodeURL,
      id_restaurante: novaMesa.id_restaurante,
      id_mesa: novaMesa.id_mesa,
    });

    res.status(201).json(novaMesa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const listarMesas = async (req, res) => {
  try {
    const mesas = await Mesa.findAll({
      include: [
        { model: Restaurante, as: "restaurante" },
        { model: StatusMesa, as: "status_mesa" },
      ],
    });
    res.status(200).json(mesas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const obterMesa = async (req, res) => {
  const { id } = req.params;
  try {
    const mesa = await Mesa.findByPk(id, {
      include: [
        { model: Restaurante, as: "restaurante" },
        { model: StatusMesa, as: "status_mesa" },
      ],
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
      include: [
        { model: Restaurante, as: "restaurante" },
        { model: StatusMesa, as: "status_mesa" },
      ],
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

const deletarMesa = async (req, res) => {
  const { id } = req.params;
  try {
    const mesa = await Mesa.findByPk(id);
    if (!mesa) {
      return res.status(404).json({ error: "Mesa não encontrada" });
    }

    await Qrcode.destroy({ where: { id_mesa: id } });

    await mesa.destroy();
    return res.status(200).json({ mensagem: "Mesa deletada com sucesso!" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
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
