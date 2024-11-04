const Sobremesas = require("../models/tb_sobremesas");
const Imagem = require("../models/tb_foto_sobremesas");

const sobremesasController = {
  criarSobremesa: async (req, res) => {
    try {
      // Cadastra a sobremesa
      const novaSobremesa = await Sobremesas.create({
        tipo_sobremesa: req.body.tipo_sobremesa,
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        valor: req.body.valor,
        id_restaurante: req.body.id_restaurante,
      });

      const defaultFilename = "default-foto.png";

      if (req.files && req.files.length > 0) {
        // Cadastra as imagens enviadas
        await Promise.all(
          req.files.map((file) =>
            Imagem.create({
              foto: `/foto/${file.filename}`,
              id_sobremesa: novaSobremesa.id_sobremesa,
            })
          )
        );
      } else {
        await Imagem.create({
          foto: `/foto/${defaultFilename}`,
          id_sobremesa: novaSobremesa.id_sobremesa,
        });
      }

      const response = {
        mensagem: "Sobremesa cadastrada com sucesso!",
        sobremesaCriada: {
          id_sobremesa: novaSobremesa.id_sobremesa,
        },
      };

      return res.status(201).send(response);
    } catch (error) {
      console.error("Erro ao criar sobremesa: ", error);
      return res
        .status(500)
        .send({ mensagem: "Erro ao criar sobremesa", error: error.message });
    }
  },

  buscarSobremesasPorRestaurante: async (req, res) => {
    try {
      const { id } = req.params;

      const sobremesas = await Sobremesas.findAll({
        where: { id_restaurante: id },
        include: [
          {
            model: Imagem,
            as: "imagens",
          },
        ],
      });

      if (!sobremesas || sobremesas.length === 0) {
        return res.status(404).send({
          mensagem: "Nenhuma sobremesa encontrada para este restaurante",
        });
      }

      return res.status(200).send(sobremesas);
    } catch (error) {
      console.error("Erro ao buscar sobremesas por restaurante: ", error);
      return res.status(500).send({
        mensagem: "Erro ao buscar sobremesas",
        error: error.message,
      });
    }
  },

  obterSobremesas: async (req, res) => {
    try {
      const sobremesas = await Sobremesas.findAll({
        include: [{ model: Imagem, as: "imagens" }],
      });

      if (!sobremesas || sobremesas.length === 0) {
        return res.status(404).send({
          mensagem: "Nenhuma sobremesa encontrada.",
        });
      }

      return res.status(200).send(sobremesas);
    } catch (error) {
      console.error("Erro ao obter sobremesas: ", error);
      return res.status(500).send({ mensagem: "Erro ao obter sobremesas", error: error.message });
    }
  },

  deletarSobremesa: async (req, res) => {
    const { id_sobremesa } = req.params;

    try {
      // Verifica se a sobremesa existe
      const sobremesa = await Sobremesas.findByPk(id_sobremesa);
      if (!sobremesa) {
        return res.status(404).send({ mensagem: "Sobremesa não encontrada!" });
      }

      // Deleta as imagens associadas
      await Imagem.destroy({ where: { id_sobremesa: id_sobremesa } });

      // Deleta a sobremesa
      await Sobremesas.destroy({ where: { id_sobremesa: id_sobremesa } });

      return res.status(200).send({ mensagem: "Sobremesa deletada com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar sobremesa: ", error);
      return res.status(500).send({ mensagem: "Erro ao deletar sobremesa", error: error.message });
    }
  },
};

module.exports = sobremesasController;
