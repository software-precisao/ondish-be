const Restaurante = require("../models/tb_restaurante");
const LatLong = require("../models/tb_lat_long");
const Pratos = require("../models/tb_pratos");
const Fotos = require("../models/tb_foto_pratos");
const QRCode = require("qrcode");
const Qrcode = require("../models/tb_qrcode");

const Usuario = require("../models/tb_usuarios");
const Avaliacao = require("../models/tb_avaliacao");
const Mesa = require("../models/tb_mesa");
const locaisPreConfigurados = require("../constants/cities");
const Opcoes = require("../models/tb_opcoes");
const Bebida = require("../models/tb_bebidas");
const FotoBebidas = require("../models/tb_foto_bebidas");
const Sobremesa = require("../models/tb_sobremesas");
const FotoSobremesas = require("../models/tb_foto_sobremesas");
const Cozinha = require("../models/tb_cozinha_restaurante");
const Pedido = require("../models/tb_pedido");

const fs = require("fs");
const path = require("path");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function uploadIdentityDocument(filePath) {
  try {
    // Caminho completo do arquivo (ajuste conforme sua estrutura de pastas)
    const absoluteFilePath = path.join(
      __dirname,
      "..",
      "..",
      `/public/logo/${filePath}`
    );
    console.log(absoluteFilePath);

    if (!fs.existsSync(absoluteFilePath)) {
      throw new Error("Arquivo não encontrado no caminho especificado");
    }

    // Verifica o tipo do arquivo com base na extensão
    const fileExtension = path.extname(filePath).toLowerCase();
    let fileType;
    if (fileExtension === ".jpg" || fileExtension === ".jpeg") {
      fileType = "image/jpeg";
    } else if (fileExtension === ".png") {
      fileType = "image/png";
    } else {
      throw new Error("Tipo de arquivo não suportado. Use JPG ou PNG.");
    }

    const file = await stripe.files.create({
      purpose: "identity_document",
      file: {
        data: fs.createReadStream(absoluteFilePath),
        name: filePath,
        type: fileType, // Define o tipo com base na extensão
      },
    });

    console.log("Documento de identidade enviado:", file);
    return file.id; // Retorna o ID do arquivo, que pode ser usado posteriormente
  } catch (error) {
    console.error("Erro ao enviar o documento:", error);
    throw error;
  }
}

async function updateIdentityVerification(accountId, fileId) {
  try {
    const verification = await stripe.accounts.update(accountId, {
      individual: {
        verification: {
          document: {
            front: fileId, // Atribuindo o ID do arquivo enviado
          },
        },
      },
    });

    console.log("Verificação de identidade atualizada:", verification);
    return verification;
  } catch (error) {
    console.error("Erro ao atualizar verificação:", error);
    throw error;
  }
}

const restauranteController = {
  criarRestaurante: async (req, res) => {
    try {
      const filenamecapa = req.files.capa
        ? req.files.capa[0].filename
        : "default-capa.png";
      const filenamelogo = req.files.logo
        ? req.files.logo[0].filename
        : "default-logo.png";

      // Criar o novo restaurante
      const novoRestaurante = await Restaurante.create({
        nif: req.body.nif,
        nome_restaurante: req.body.nome_restaurante,
        ibam: req.body.ibam,
        website: req.body.website,
        facebook: req.body.facebook,
        logo: `/logo/${filenamelogo}`,
        capa: `/capa/${filenamecapa}`,
        instagram: req.body.instagram,
        telefone1: req.body.telefone1,
        telefone2: req.body.telefone2,
        morada: req.body.morada,
        codigo_postal: req.body.codigo_postal,
        id_user: req.body.id_user,
        mcc: req.body.mcc,
      });

      // Gerar QR Code
      const qrData = novoRestaurante.id_restaurante.toString();
      const qrCodeURL = await QRCode.toDataURL(qrData);
      await novoRestaurante.update({ qrcode: qrCodeURL });

      // Verificar o usuário
      const id_user = req.body.id_user;
      const usuario = await Usuario.findByPk(id_user);
      if (!usuario) {
        return res.status(404).send({ mensagem: "Usuário não encontrado!" });
      }

      if (usuario.config !== 2) {
        return res
          .status(400)
          .send({ mensagem: "A configuração do usuário não é 2!" });
      }

      // Atualizar configuração do usuário
      usuario.config = 1;
      await usuario.save();

      // Criar a conta Stripe (usando os dados do usuário)
      const stripeAccount = await stripe.accounts.create({
        type: "custom",
        country: "PT",
        email: usuario.email,
        business_type: "individual",
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_profile: {
          name: novoRestaurante.nome_restaurante,
          mcc: req.body.mcc,
          url: novoRestaurante.website,
        },
        individual: {
          first_name: req.body.nome,
          last_name: req.body.sobrenome,
          email: req.body.email,
          phone: req.body.telefone1,
          dob: {
            day: req.body.dia_nascimento,
            month: req.body.mes_nascimento,
            year: req.body.ano_nascimento,
          },
          address: {
            line1: novoRestaurante.morada,
            city: req.body.cidade,
            postal_code: novoRestaurante.codigo_postal,
            country: "PT",
          },
          id_number: req.body.numero_identificacao,
        },
        external_account: {
          object: "bank_account",
          country: "PT",
          currency: "EUR",
          account_holder_name: novoRestaurante.nome_restaurante,
          account_holder_type: "company",
          account_number: novoRestaurante.ibam,
        },
      });

      // Gerar link de onboarding para o usuário aceitar os TOS
      const accountLink = await stripe.accountLinks.create({
        account: stripeAccount.id,
        refresh_url: "https://ondish.com/refresh",
        return_url: "https://ondish.com/success",
        type: "account_onboarding",
      });

      const fileId = await uploadIdentityDocument(filenamelogo);

      // Atualizar a verificação de identidade com o arquivo enviado
      await updateIdentityVerification(stripeAccount.id, fileId);

      // Atualizar o restaurante com o ID da conta Stripe
      await novoRestaurante.update({ stripe_account_id: stripeAccount.id });

      // Resposta de sucesso com link de onboarding
      const response = {
        mensagem: "Restaurante cadastrado com sucesso!",
        restauranteCriado: {
          id_restaurante: novoRestaurante.id_restaurante,
          stripe_account_id: stripeAccount.id,
          onboarding_url: accountLink.url,
          request: {
            tipo: "GET",
          },
        },
      };

      return res.status(202).send(response);
    } catch (error) {
      console.error("Erro ao criar restaurante: ", error);
      return res
        .status(500)
        .send({ mensagem: "Erro ao criar restaurante", error: error.message });
    }
  },

  buscarTodos: async (req, res) => {
    try {
      const restaurantes = await Restaurante.findAll({
        include: [
          {
            model: Pratos,
            as: "pratos",
            include: [
              {
                model: Opcoes,
                as: "opcoes",
              },
              {
                model: Fotos,
                as: "fotos",
              },
              {
                model: Cozinha,
                as: "cozinha_restaurante",
              },
            ],
          },
          {
            model: Bebida,
            as: "bebidas",
            include: [
              {
                model: FotoBebidas,
                as: "fotos",
              },
            ],
          },
          {
            model: Sobremesa,
            as: "sobremesa",
            include: [
              {
                model: FotoSobremesas,
                as: "fotos",
              },
            ],
          },
          {
            model: Cozinha,
            as: "cozinha_restaurante",
          },
          {
            model: Avaliacao,
            as: "avaliacoes",
            include: [
              {
                model: Usuario,
              },
            ],
          },
          {
            model: Pedido,
            as: "pedidos",
          },
        ],
      });

      return res.status(200).send(restaurantes);
    } catch (error) {
      console.error("Erro ao buscar restaurantes: ", error);
      return res.status(500).send({
        mensagem: "Erro ao buscar restaurantes",
        error: error.message,
      });
    }
  },
  buscarRestaurantePorId: async (req, res) => {
    try {
      const { id } = req.params;

      const restaurante = await Restaurante.findAll({
        where: { id_restaurante: id },
        include: [
          {
            model: Avaliacao,
            as: "avaliacoes",
          },
        ],
      });

      if (!restaurante) {
        return res.status(404).send({ mensagem: "Restaurante não encontrado" });
      }

      return res.status(200).send(restaurante);
    } catch (error) {
      console.error("Erro ao buscar restaurante por ID: ", error);
      return res.status(500).send({
        mensagem: "Erro ao buscar restaurante",
        error: error.message,
      });
    }
  },
  // Atualizar um Restaurante
  atualizarRestaurante: async (req, res) => {
    const { id } = req.params;
    try {
      const atualizado = await Restaurante.update(req.body, {
        where: { id_restaurante: id },
      });
      if (atualizado[0] > 0) {
        return res
          .status(200)
          .send({ mensagem: "Restaurante atualizado com sucesso" });
      }
      return res.status(404).send({ mensagem: "Restaurante não encontrado" });
    } catch (error) {
      console.error("Erro ao atualizar restaurante: ", error);
      return res.status(500).send({
        mensagem: "Erro ao atualizar restaurante",
        error: error.message,
      });
    }
  },

  // Deletar um Restaurante
  deletarRestaurante: async (req, res) => {
    const { id_restaurante } = req.params;
    try {
      await Qrcode.destroy({
        where: { id_restaurante: id_restaurante },
      });

      await Mesa.destroy({
        where: { id_restaurante: id_restaurante },
      });

      await Avaliacao.destroy({
        where: { id_restaurante: id_restaurante },
      });

      const deletado = await Restaurante.destroy({
        where: { id_restaurante: id_restaurante },
      });

      if (deletado) {
        return res
          .status(200)
          .send({ mensagem: "Restaurante deletado com sucesso" });
      }
      return res.status(404).send({ mensagem: "Restaurante não encontrado" });
    } catch (error) {
      console.error("Erro ao deletar restaurante: ", error);
      return res.status(500).send({
        mensagem: "Erro ao deletar restaurante",
        error: error.message,
      });
    }
  },

  buscarLocaisRestaurante: (req, res) => {
    const termoBusca = req.query.termo || "";
    console.log("Termo de busca:", termoBusca);

    const termoNormalizado = termoBusca.toLowerCase();
    const locaisFiltrados = locaisPreConfigurados.filter((local) =>
      local.nome.toLowerCase().includes(termoNormalizado)
    );

    console.log("Locais pre-configurados:", locaisPreConfigurados);

    if (locaisFiltrados.length === 0) {
      return res.status(404).json({ mensagem: "Nenhum local encontrado." });
    }
    console.log("Locais filtrados:", locaisFiltrados);

    return res.status(200).json(locaisFiltrados);
  },
};

module.exports = restauranteController;
