const PreferenciasUsuario = require("../models/tb_preferencias_user");

const PreferenciasUsuarioController = {
  async obterPreferencias(req, res) {
    const { id_user } = req.params;

    try {
      const preferencias = await PreferenciasUsuario.findOne({
        where: { id_user },
      });

      if (!preferencias) {
        return res
          .status(404)
          .json({ message: "Preferências não encontradas para o usuário." });
      }

      return res.status(200).json(preferencias);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar preferências do usuário." });
    }
  },

  async atualizarPreferencias(req, res) {
    const { id_user } = req.params;
    const {
      notificacoes_pedido,
      notificacoes_dicas_e_promocao,
      email_dicas_e_promocao,
      notificacoes_ofertas_parceiros,
      email_ofertas_parceiros,
    } = req.body;

    try {
      const preferencias = await PreferenciasUsuario.findOne({
        where: { id_user },
      });

      if (!preferencias) {
        return res
          .status(404)
          .json({ message: "Preferências não encontradas para o usuário." });
      }

      await preferencias.update({
        notificacoes_pedido,
        notificacoes_dicas_e_promocao,
        email_dicas_e_promocao,
        notificacoes_ofertas_parceiros,
        email_ofertas_parceiros,
      });

      return res
        .status(200)
        .json({ message: "Preferências atualizadas com sucesso." });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao atualizar preferências." });
    }
  },

  async criarPreferencias(req, res) {
    const { id_user } = req.params;
    const {
      notificacoes_pedido = false,
      notificacoes_dicas_e_promocao = false,
      email_dicas_e_promocao = false,
      notificacoes_ofertas_parceiros = false,
      email_ofertas_parceiros = false,
    } = req.body;

    try {
      const [preferencias, created] = await PreferenciasUsuario.findOrCreate({
        where: { id_user },
        defaults: {
          notificacoes_pedido,
          notificacoes_dicas_e_promocao,
          email_dicas_e_promocao,
          notificacoes_ofertas_parceiros,
          email_ofertas_parceiros,
        },
      });

      if (created) {
        return res.status(201).json({
          message: "Preferências criadas com sucesso.",
          preferencias,
        });
      } else {
        return res.status(200).json({
          message: "Preferências já existentes para o usuário.",
          preferencias,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro ao criar preferências.",
      });
    }
}

};

module.exports = PreferenciasUsuarioController;
