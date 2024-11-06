const Promocao = require("../models/tb_promocao");
const UsuarioPromocao = require("../models/tb_usuario_promocao");

const promocaoController = {
  listarPromocoes: async (req, res) => {
    try {
      const promocoes = await Promocao.findAll();
      return res.status(200).send(promocoes);
    } catch (error) {
      console.error("Erro ao listar promoções:", error);
      return res.status(500).send({ mensagem: "Erro ao listar promoções." });
    }
  },

  aplicarPromocao: async (req, res) => {
    try {
      const { id_user, id_promocao } = req.body;

      const usuarioPromocaoExistente = await UsuarioPromocao.findOne({
        where: { id_user, id_promocao },
      });

      if (usuarioPromocaoExistente) {
        return res.status(400).send({
          mensagem: "Promoção já utilizada pelo usuário.",
        });
      }

      await UsuarioPromocao.create({ id_user, id_promocao });

      return res.status(200).send({
        mensagem: "Promoção aplicada com sucesso.",
        id_promocao,
      });
    } catch (error) {
      console.error("Erro ao aplicar promoção:", error);
      return res.status(500).send({ mensagem: "Erro ao aplicar promoção." });
    }
  },

  atualizarPromocao: async (req, res) => {
    try {
      const { id_promocao } = req.params;
      const { nome, porcentagem_desconto, valor_minimo, codigo } = req.body;

      const promocao = await Promocao.findByPk(id_promocao);
      if (!promocao) {
        return res.status(404).send({ mensagem: "Promoção não encontrada." });
      }

      await promocao.update({
        nome,
        porcentagem_desconto,
        valor_minimo,
        codigo,
      });

      return res.status(200).send({
        mensagem: "Promoção atualizada com sucesso.",
        promocao,
      });
    } catch (error) {
      console.error("Erro ao atualizar promoção:", error);
      return res.status(500).send({ mensagem: "Erro ao atualizar promoção." });
    }
  },

  excluirPromocao: async (req, res) => {
    try {
      const { id_promocao } = req.params;

      await UsuarioPromocao.destroy({ where: { id_promocao } });

      const promocao = await Promocao.findByPk(id_promocao);
      if (!promocao) {
        return res.status(404).send({ mensagem: "Promoção não encontrada." });
      }
      await promocao.destroy();

      return res
        .status(200)
        .send({ mensagem: "Promoção excluída com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir promoção:", error);
      return res.status(500).send({
        mensagem: "Erro ao excluir promoção.",
        error: error.message,
      });
    }
  },

  criarPromocao: async (req, res) => {
    try {
      const { nome, porcentagem_desconto, valor_minimo, codigo } = req.body;

      const novaPromocao = await Promocao.create({
        nome,
        porcentagem_desconto,
        valor_minimo,
        codigo,
      });

      return res.status(201).send({
        mensagem: "Promoção criada com sucesso.",
        promocao: novaPromocao,
      });
    } catch (error) {
      console.error("Erro ao criar promoção:", error);
      return res.status(500).send({
        mensagem: "Erro ao criar promoção.",
        error: error.message,
      });
    }
  },
};

module.exports = promocaoController;
