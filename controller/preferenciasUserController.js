const PreferenciasUsuario = require("../models/tb_preferencias_user");

const PreferenciasUsuarioController = {
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
};

module.exports = PreferenciasUsuarioController;
