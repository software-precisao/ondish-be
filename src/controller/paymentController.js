const axios = require("axios");
const Stripe = require("stripe");
const dotenv = require("dotenv");
const Pedido = require("../models/tb_pedido");
const Restaurante = require("../models/tb_restaurante");

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// cartão de crédito
const createCardPaymentIntent = async (pedido, tokenId) => {
  const paymentMethod = await stripe.paymentMethods.create({
    type: "card",
    card: { token: tokenId },
  });

  return await stripe.paymentIntents.create({
    amount: pedido.valor_total * 100,
    currency: "eur",
    payment_method: paymentMethod.id,
    confirm: true,
  });
};

// multibanco
const createMultibancoPaymentIntent = async (pedido) => {
  return await stripe.paymentIntents.create({
    amount: pedido.valor_total * 100,
    currency: "eur",
    payment_method_types: ["multibanco"],
  });
};

//banco act
const createBancontactPaymentIntent = async (pedido) => {
  try {
    const returnUrl = "https://ondish.com"; // Defina sua URL de retorno

    const paymentIntent = await stripe.paymentIntents.create({
      amount: pedido.valor_total * 100,
      currency: "eur",
      payment_method_types: ["bancontact"],
      confirm: true, // Confirma o pagamento imediatamente

      return_url: returnUrl,
    });

    return paymentIntent;
  } catch (error) {
    console.error(
      "Erro ao criar PaymentIntent para Bancontact:",
      error.message
    );
    throw error;
  }
};

// const confirmBancontactPaymentIntent = async (paymentIntentId, paymentMethodId) => {
//   try {
//     const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
//       payment_method: paymentMethodId,
//     });

//     return paymentIntent;
//   } catch (error) {
//     console.error("Erro ao confirmar o PaymentIntent:", error.message);
//     throw error;
//   }
// };

const createPaymentIntentWithSplit = async (pedido, paymentMethodId) => {
  try {
    const restaurante = await Restaurante.findByPk(pedido.id_restaurante);
    if (!restaurante || !restaurante.stripe_account_id) {
      throw new Error(
        "Restaurante não encontrado ou sem conta Stripe configurada."
      );
    }

    const applicationFee = Math.round(pedido.valor_total * 0.1 * 100); // Taxa da plataforma: 10%
    const amountToRestaurante = pedido.valor_total * 100 - applicationFee;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: pedido.valor_total * 100, // Valor total em centavos
      currency: "eur",
      payment_method: paymentMethodId, // Método de pagamento fornecido pelo cliente
      confirmation_method: "automatic", // Confirmação automática
      confirm: true,
      transfer_data: {
        amount: amountToRestaurante, // Valor transferido para o restaurante
        destination: restaurante.stripe_account_id, // Conta do restaurante no Stripe
      },
      application_fee_amount: applicationFee, // Taxa da plataforma
    });

    return paymentIntent;
  } catch (error) {
    console.error("Erro ao criar PaymentIntent com split:", error.message);
    throw error;
  }
};

const createPaymentIntent = async (req, res) => {
  try {
    const { id_pedido, metodo_pagamento, payment_method_id } = req.body;

    const pedido = await Pedido.findByPk(id_pedido);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    let paymentIntent;

    switch (metodo_pagamento) {
      case "card":
        if (!payment_method_id) {
          return res
            .status(400)
            .json({ error: "Payment method ID não fornecido." });
        }
        paymentIntent = await createPaymentIntentWithSplit(
          pedido,
          payment_method_id
        );
        break;

      case "multibanco":
        paymentIntent = await createMultibancoPaymentIntent(pedido);
        break;

      case "bancontact":
        if (!payment_method_id) {
          return res
            .status(400)
            .json({ error: "Payment method ID não fornecido." });
        }
        paymentIntent = await createBancontactPaymentIntent(pedido);
        break;

      default:
        return res.status(400).json({ error: "Método de pagamento inválido." });
    }

    await Pedido.update(
      { id_payment_intent: paymentIntent.id, status: "Pagamento em progresso" },
      { where: { id_pedido } }
    );

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Erro ao criar Payment Intent:", error.message);
    res.status(500).json({ error: "Erro ao criar Payment Intent" });
  }
};

const checkPaymentStatus = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent.status;
  } catch (error) {
    console.error("Erro ao verificar status do pagamento:", error);
  }
};

const getPaymentStatus = async (req, res) => {
  const { paymentIntentId } = req.params;

  if (!paymentIntentId) {
    return res.status(400).json({ error: "PaymentIntent ID não fornecido." });
  }

  try {
    const status = await checkPaymentStatus(paymentIntentId);

    if (status) {
      res.status(200).json({ status });
    } else {
      res.status(404).json({ error: "PaymentIntent não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao verificar status do pagamento:", error.message);
    res.status(500).json({ error: "Erro ao verificar status do pagamento." });
  }
};

// const webhook = (req, res) => {
//   const sig = req.headers["stripe-signature"];
//   let event;

//   try {
//     // Verifique a assinatura do webhook com o corpo da requisição bruto
//     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

//     // Se a assinatura for verificada com sucesso, processamos o evento
//     console.log("Webhook verificado com sucesso!");

//     switch (event.type) {
//       case "payment_intent.created":
//         handlePaymentIntentCreated(event.data.object);
//         break;
//       case "payment_intent.payment_failed":
//         handlePaymentIntentFailed(event.data.object);
//         break;
//       case "payment_intent.succeeded":
//         handlePaymentIntentSucceeded(event.data.object);
//         break;
//       default:
//         console.log(`Tipo de evento não tratado: ${event.type}`);
//     }

//     res.status(200).json({ received: true });
//   } catch (err) {
//     console.error("Erro na verificação do webhook:", err.message);
//     res.status(400).send(`Erro no Webhook: ${err.message}`);
//   }
// };

async function handlePaymentIntentCreated(paymentIntent) {
  await Pedido.update(
    { status: "Pagamento em progresso" },
    { where: { id_payment_intent: paymentIntent.id } }
  );
  console.log("PaymentIntent criado:", paymentIntent.id);
}

async function handlePaymentIntentFailed(paymentIntent) {
  await Pedido.update(
    { status: "Pagamento falhou" },
    { where: { id_payment_intent: paymentIntent.id } }
  );
  console.log("Pagamento falhou para PaymentIntent:", paymentIntent.id);
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  await Pedido.update(
    { status: "Pago", pago: true },
    { where: { id_payment_intent: paymentIntent.id } }
  );
  console.log("Pagamento bem-sucedido para PaymentIntent:", paymentIntent.id);
}

// Função para criar PaymentIntent
async function criarPaymentIntent(totalAmount, stripeCustomerId, paymentType) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount, // Total em centavos (e.g., 5000 = 50 EUR)
      currency: "eur",
      payment_method_types: [paymentType], // Aceita pagamento com cartão
      customer: stripeCustomerId, // ID do cliente salvo no Stripe
      transfer_group: `group_${new Date().getTime()}`, // Identificador único
      description: "Pagamento de pedido no aplicativo",
    });

    return paymentIntent;
  } catch (error) {
    console.error("Erro ao criar PaymentIntent:", error.message);
    throw error;
  }
}

// Função para criar o método de pagamento (Payment Method)
async function criarPaymentMethod(cardDetails) {
  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: cardDetails, // Dados do cartão: número, validade, CVV
    });

    return paymentMethod;
  } catch (error) {
    console.error("Erro ao criar PaymentMethod:", error.message);
    throw error;
  }
}

// Função para confirmar o pagamento
async function confirmarPagamento(
  paymentIntentId,
  paymentMethodId,
  metodoPagamento
) {
  try {
    // if (metodoPagamento === "mbway") {
    //   // Chama o webhook para confirmar o pagamento via MB Way
    //   const paymentStatus = await chamarWebhookMBWay(paymentIntentId);

    //   // Se o pagamento não for confirmado, lançar um erro
    //   if (paymentStatus !== "succeeded") {
    //     throw new Error("Pagamento MB Way não confirmado.");
    //   }

    //   // Caso o pagamento via MB Way seja confirmado, retorna o status de sucesso
    //   return {
    //     status: "succeeded",
    //     message: "Pagamento MB Way confirmado com sucesso.",
    //   };
    // }

    const confirmedPayment = await stripe.paymentIntents.confirm(
      paymentIntentId,
      {
        payment_method: paymentMethodId, // ID do PaymentMethod criado
      }
    );

    return confirmedPayment;
  } catch (error) {
    console.error("Erro ao confirmar pagamento:", error.message);
    throw error;
  }
}

async function confirmarPagamentoMBWAY(paymentIntentId) {
  try {
    // Confirmar o pagamento com Stripe
    const confirmedPayment = await stripe.paymentIntents.confirm(
      paymentIntentId,
      {
        payment_method_data: {
          type: "mb_way", // Método de pagamento MB WAY
          billing_details: {
            phone: "+351935621260", // Substitua pelo número de telefone do cliente
          },
        },
      }
    );

    // Se o pagamento requer ação (ex: autenticação MB WAY)
    if (confirmedPayment.status === "requires_action") {
      console.log("Ação requerida pelo cliente no MB WAY.");
      // Aqui você poderia chamar um webhook ou processo externo para aguardar a ação
      const paymentStatus = await chamarWebhookMBWay(paymentIntentId);

      // Verifica o status do pagamento após a ação do cliente
      if (paymentStatus === "succeeded") {
        console.log("Pagamento confirmado após ação do cliente no MB WAY.");
        return {
          status: "succeeded",
          message: "Pagamento confirmado via MB WAY.",
        };
      } else {
        throw new Error("Pagamento não confirmado após ação do cliente.");
      }
    }

    // Se o pagamento não requer ação, já está confirmado
    return confirmedPayment;
  } catch (error) {
    console.error("Erro ao confirmar pagamento MB WAY:", error.message);
    throw error; // Propaga o erro
  }
}

// Função para chamar o webhook que verifica o status do pagamento MB WAY
async function chamarWebhookMBWay(paymentIntentId) {
  try {
    // Chama seu webhook para verificar o status do pagamento no MB WAY
    const response = await axios.post(
      "/payment/webhook",
      {
        paymentIntentId: paymentIntentId,
      },
      {
        headers: {
          "Content-Type": "application/json", // O corpo será no formato JSON
        },
      }
    );

    // Verifica se a resposta indica que o pagamento foi bem-sucedido
    if (response.data.status === "succeeded") {
      return "succeeded";
    }

    return "failed";
  } catch (error) {
    console.error("Erro ao chamar o webhook MB WAY:", error.message);
    throw new Error("Erro ao verificar status do pagamento MB WAY.");
  }
}

// Função para realizar a transferência para o restaurante
async function realizarTransferencia(
  paymentIntent,
  restauranteStripeAccountId
) {
  try {
    const totalAmount = paymentIntent.amount; // Total em centavos
    const platformFee = Math.round(totalAmount * 0.12); // 12%
    const restaurantAmount = totalAmount - platformFee;

    // Transferir para o restaurante
    await stripe.transfers.create({
      amount: restaurantAmount,
      currency: "eur",
      destination: restauranteStripeAccountId,
      transfer_group: paymentIntent.transfer_group,
    });

    console.log("Transferência realizada com sucesso.");
  } catch (error) {
    console.error("Erro ao realizar transferência:", error.message);
    throw error;
  }
}

// Função principal para processar o pagamento
const processarPagamento = async (req, res) => {
  try {
    const {
      totalAmount,
      paymentMethodId,
      stripeCustomerId,
      restauranteStripeAccountId,
      paymentType,
    } = req.body;

    // Verificar dados obrigatórios
    if (
      !totalAmount ||
      !paymentMethodId ||
      !stripeCustomerId ||
      !restauranteStripeAccountId ||
      !paymentType
    ) {
      return res.status(400).json({ error: "Dados de pagamento incompletos." });
    }

    // Etapa 1: Criar PaymentIntent
    const paymentIntent = await criarPaymentIntent(
      totalAmount,
      stripeCustomerId,
      paymentType
    );
    if (!paymentIntent) {
      return res.status(500).json({ error: "Erro ao criar Payment Intent." });
    }

    // Etapa 2: Criar PaymentMethod com os detalhes do cartão
    // const paymentMethod = await criarPaymentMethod(cardDetails);
    // if (!paymentMethod) {
    //   return res.status(500).json({ error: "Erro ao criar Payment Method." });
    // }

    // Etapa 3: Confirmar Pagamento
    let confirmedPayment;
    if (paymentType === "mbway") {
      // Confirmar pagamento com MB WAY
      confirmedPayment = await confirmarPagamentoMBWAY(paymentIntent.id);
      if (confirmedPayment.status !== "succeeded") {
        return res.status(400).json({
          error: "Pagamento com MB WAY não confirmado.",
        });
      }
    } else if (paymentType === "card") {
      // Confirmar pagamento com cartão
      confirmedPayment = await confirmarPagamento(
        paymentIntent.id,
        paymentMethodId
      );
      if (!confirmedPayment || confirmedPayment.status !== "succeeded") {
        return res.status(400).json({ error: "Pagamento não confirmado." });
      }
    }

    // Etapa 4: Realizar transferência para o restaurante
    await realizarTransferencia(confirmedPayment, restauranteStripeAccountId);

    console.log("Pagamento processado com sucesso.");
    return res.status(200).json({
      success: true,
      message: "Pagamento concluído",
      data: confirmedPayment,
    });
  } catch (error) {
    console.error("Erro no processo de pagamento:", error.message);
    return res
      .status(500)
      .json({ error: "Erro no processo de pagamento", details: error.message });
  }
};

const webhook = (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Erro ao verificar a assinatura do webhook:", err.message);
    return res.status(400).send("Webhook signature verification failed.");
  }

  // Processamento do evento
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("Pagamento confirmado:", paymentIntent.id);
      // Atualizar status no banco de dados ou outras ações necessárias
      break;

    case "payment_intent.payment_failed":
      const failedPaymentIntent = event.data.object;
      console.log("Pagamento falhou:", failedPaymentIntent.id);
      // Lidar com a falha de pagamento
      break;

    default:
      console.log(`Evento desconhecido: ${event.type}`);
  }

  // Retornar uma resposta ao Stripe
  res.status(200).send("Webhook recebido com sucesso");
};

const associateCardToCustomer = async (req, res) => {
  const { customerId, paymentMethodId } = req.body;

  // Verificar se os dados necessários foram fornecidos
  if (!customerId || !paymentMethodId) {
    return res.status(400).json({
      error: "ID do cliente ou ID do método de pagamento não fornecido.",
    });
  }

  try {
    // Recuperar o cliente do Stripe
    const customer = await stripe.customers.retrieve(customerId);

    // Verificar se o cliente existe
    if (!customer) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }

    // Associar o método de pagamento ao cliente
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Definir o método de pagamento como o método de pagamento principal do cliente
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Retornar sucesso
    res
      .status(200)
      .json({ message: "Cartão associado com sucesso ao cliente." });
  } catch (error) {
    console.error("Erro ao associar cartão ao cliente:", error.message);
    res.status(500).json({ error: "Erro ao associar o cartão ao cliente." });
  }
};

module.exports = {
  createPaymentIntent,
  createPaymentIntentWithSplit,
  webhook,
  checkPaymentStatus,
  getPaymentStatus,
  processarPagamento,
  associateCardToCustomer,
};
