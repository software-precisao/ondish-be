const Bebidas = require("../models/tb_bebidas");
const Imagem = require("../models/tb_foto_bebidas");

const bebidasController = {
  criarBebidas: async (req, res) => {
    try {
      // Cadastra a bebida
      const novaBebidas = await Bebidas.create({
        tipo_bebida: req.body.tipo_bebida,
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
              id_bebida: novaBebidas.id_bebida,
            })
          )
        );
      } else {
        await Imagem.create({
          foto: `/foto/${defaultFilename}`,
          id_bebida: novaBebidas.id_bebida,
        });
      }

      const response = {
        mensagem: "Bebida cadastrada com sucesso!",
        bebidaCriada: {
          id_bebida: novaBebidas.id_bebida,
        },
      };

      return res.status(201).send(response);
    } catch (error) {
      console.error("Erro ao criar bebida: ", error);
      return res
        .status(500)
        .send({ mensagem: "Erro ao criar bebida", error: error.message });
    }
  },

  buscarBebidasPorRestaurante: async (req, res) => {
    try {
      const { id } = req.params;

      const bebidas = await Bebidas.findAll({
        where: { id_restaurante: id },
        include: [
          {
            model: Imagem,
            as: "imagens",
          },
        ],
      });

      if (!bebidas || bebidas.length === 0) {
        return res.status(404).send({
          mensagem: "Nenhuma bebida encontrada para este restaurante",
        });
      }

      return res.status(200).send(bebidas);
    } catch (error) {
      console.error("Erro ao buscar bebidas por restaurante: ", error);
      return res.status(500).send({
        mensagem: "Erro ao buscar bebidas",
        error: error.message,
      });
    }
  },

  obterBebidas: async (req, res) => {
    try {
      const bebidas = await Bebidas.findAll({
        include: [{ model: Imagem, as: "imagens" }],
      });

      if (!bebidas || bebidas.length === 0) {
        return res.status(404).send({
          mensagem: "Nenhuma bebida encontrada.",
        });
      }

      return res.status(200).send(bebidas);
    } catch (error) {
      console.error("Erro ao obter bebidas: ", error);
      return res.status(500).send({ mensagem: "Erro ao obter bebidas", error: error.message });
    }
  },

 deletarBebida: async (req, res) => {
    const { id_bebida } = req.params;

    try {
      // Verifica se a bebida existe
      const bebida = await Bebidas.findByPk(id_bebida);
      if (!bebida) {
        return res.status(404).send({ mensagem: "Bebida não encontrada!" });
      }

      // Deleta as imagens associadas
      await Imagem.destroy({ where: { id_bebida: id_bebida } });

      // Deleta a bebida
      await Bebidas.destroy({ where: { id_bebida: id_bebida } });

      return res.status(200).send({ mensagem: "Bebida deletada com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar bebida: ", error);
      return res.status(500).send({ mensagem: "Erro ao deletar bebida", error: error.message });
    }
  },
};


module.exports = bebidasController;
