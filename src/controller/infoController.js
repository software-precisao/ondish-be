const AppInfo = require("../models/tb_infos");

const appInfoController = {
  getAppInfo: async (req, res) => {
    try {
      const appInfo = await AppInfo.findOne({ where: { id_info: 1 } });
      if (!appInfo) {
        return res
          .status(404)
          .send({ mensagem: "Informações do aplicativo não encontradas." });
      }
      res.status(200).send(appInfo);
    } catch (error) {
      console.error("Erro ao buscar informações do aplicativo: ", error);
      res
        .status(500)
        .send({ mensagem: "Erro ao buscar informações do aplicativo." });
    }
  },

  createAppInfo: async (req, res) => {
    try {
      const {
        versao_atual,
        link_termos_condicoes,
        link_politica_privacidade,
        link_play_store,
        link_app_store,
      } = req.body;

      const newAppInfo = await AppInfo.create({
        versao_atual,
        link_termos_condicoes,
        link_politica_privacidade,
        link_play_store,
        link_app_store,
      });

      res.status(201).send({
        mensagem: "Informações do aplicativo criadas com sucesso.",
        dados: newAppInfo,
      });
    } catch (error) {
      console.error("Erro ao criar informações do aplicativo: ", error);
      res
        .status(500)
        .send({ mensagem: "Erro ao criar informações do aplicativo." });
    }
  },

  updateAppInfo: async (req, res) => {
    try {
      const {
        versao_atual,
        link_termos_condicoes,
        link_politica_privacidade,
        link_play_store,
        link_app_store,
      } = req.body;

      const appInfo = await AppInfo.findOne({ where: { id_info: 1 } });
      if (!appInfo) {
        return res
          .status(404)
          .send({ mensagem: "Informações do aplicativo não encontradas." });
      }

      await appInfo.update({
        versao_atual,
        link_termos_condicoes,
        link_politica_privacidade,
        link_play_store,
        link_app_store,
      });

      res.status(200).send({
        mensagem: "Informações do aplicativo atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar informações do aplicativo: ", error);
      res
        .status(500)
        .send({ mensagem: "Erro ao atualizar informações do aplicativo." });
    }
  },

  deleteAppInfo: async (req, res) => {
    try {
      const { id } = req.params;
      const appInfo = await AppInfo.findByPk(id);
      if (!appInfo) {
        return res
          .status(404)
          .send({ mensagem: "Informações do aplicativo não encontradas." });
      }

      await appInfo.destroy();
      res
        .status(200)
        .send({ mensagem: "Informações do aplicativo excluídas com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir informações do aplicativo: ", error);
      res
        .status(500)
        .send({ mensagem: "Erro ao excluir informações do aplicativo." });
    }
  },
};

module.exports = appInfoController;
