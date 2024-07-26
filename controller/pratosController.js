const Pratos = require("../models/tb_pratos");
const Opcao = require("../models/tb_opcoes");
const Imagem = require("../models/tb_foto_pratos");
const CozinhaRestaurante = require('../models/tb_cozinha_restaurante');

const pratosController = {
  criarPratos: async (req, res) => {
    try {
      // Cadastra o prato
      const novoPrato = await Pratos.create({
        tipo_prato: req.body.tipo_prato,
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        tempo_preparo: req.body.tempo_preparo,
        valor: req.body.valor,
        taxa_ondish: req.body.taxa,
        id_cozinha_restaurante: req.body.id_cozinha,
        id_restaurante: req.body.id_restaurante,
        prato_do_dia: 2,
      });

      // Cadastra as opções
      if (req.body.opcoes) {
        const opcoes = JSON.parse(req.body.opcoes);
        if (Array.isArray(opcoes)) {
          await Promise.all(
            opcoes.map((opcao) =>
              Opcao.create({
                titulo: opcao.titulo,
                tipo: opcao.tipo,
                valorAdicional: opcao.valorAdicional,
                obrigatorio: opcao.obrigatorio,
                id_pratos: novoPrato.id_pratos,
              })
            )
          );
        }
      }

      const defaultFilename = "default-foto.png";

      // Verifica se há fotos enviadas
      if (req.files && req.files.length > 0) {
        // Cadastra as imagens enviadas
        await Promise.all(
          req.files.map((file) =>
            Imagem.create({
              foto: `/foto/${file.filename}`,
              id_pratos: novoPrato.id_pratos,
            })
          )
        );
      } else {
        await Imagem.create({
          foto: `/foto/${defaultFilename}`,
          id_pratos: novoPrato.id_pratos,
        });
      }

      // Resposta de sucesso
      const response = {
        mensagem: "Prato com opções cadastrado com sucesso!",
        pratoCriado: {
          id_pratos: novoPrato.id_pratos,
        },
      };

      return res.status(201).send(response);
    } catch (error) {
      console.error("Erro ao criar prato: ", error);
      return res
        .status(500)
        .send({ mensagem: "Erro ao criar prato", error: error.message });
    }
  },

  buscarPratoPorId: async (req, res) => {
    try {
      const { id } = req.params;

      const prato = await Pratos.findAll({
        where: { id_restaurante: id },
        include: [
          {
            model: Opcao,
            as: "opcoes",
          },
          {
            model: Imagem,
            as: "fotos",
          },
          {
            model: CozinhaRestaurante,
            as: "cozinha_restaurante",
          },
        ],
      });

      if (!prato) {
        return res.status(404).send({ mensagem: "Prato não encontrado" });
      }

      return res.status(200).send(prato);
    } catch (error) {
      console.error("Erro ao buscar prato por ID: ", error);
      return res
        .status(500)
        .send({ mensagem: "Erro ao buscar prato", error: error.message });
    }
  },

  atualizarPratoDoDia: async (req, res) => {
    try {
      const { id_pratos, prato_do_dia } = req.body;

      // Verifica se o prato existe
      const prato = await Pratos.findByPk(id_pratos);
      if (!prato) {
        return res.status(404).send({ mensagem: "Prato não encontrado!" });
      }

      // Atualiza o campo prato_do_dia
      prato.prato_do_dia = prato_do_dia;
      await prato.save();

      return res.status(200).send({
        mensagem: "Prato do dia atualizado com sucesso!",
        pratoAtualizado: {
          id_pratos: prato.id_pratos,
          prato_do_dia: prato.prato_do_dia,
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar prato do dia: ", error);
      return res.status(500).send({ mensagem: "Erro ao atualizar prato do dia", error: error.message });
    }
  },

  deletarPrato: async (req, res) => {
    const { id_pratos } = req.params;

    try {
      // Verifica se o prato existe
      const prato = await Pratos.findByPk(id_pratos);
      if (!prato) {
        return res.status(404).send({ mensagem: "Prato não encontrado!" });
      }

      // Deleta as opções associadas
      await Opcao.destroy({ where: { id_pratos: id_pratos } });

      // Deleta as imagens associadas
      await Imagem.destroy({ where: { id_pratos: id_pratos } });

      // Deleta o prato
      await Pratos.destroy({ where: { id_pratos: id_pratos } });

      return res.status(200).send({ mensagem: "Prato deletado com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar prato: ", error);
      return res.status(500).send({ mensagem: "Erro ao deletar prato", error: error.message });
    }
  },
};

module.exports = pratosController;
