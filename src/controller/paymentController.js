const axios = require("axios");
const Stripe = require("stripe");
const dotenv = require("dotenv");

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      payment_method_types: ["card", "multibanco", "bancontact"],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Erro ao criar Payment Intent:", error);
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

const webhook = (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Verifique a assinatura do webhook com o corpo da requisição bruto
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    // Se a assinatura for verificada com sucesso, processamos o evento
    console.log("Webhook verificado com sucesso!");

    switch (event.type) {
      case "payment_intent.created":
        handlePaymentIntentCreated(event.data.object);
        break;
      case "payment_intent.payment_failed":
        handlePaymentIntentFailed(event.data.object);
        break;
      case "payment_intent.succeeded":
        handlePaymentIntentSucceeded(event.data.object);
        break;
      default:
        console.log(`Tipo de evento não tratado: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Erro na verificação do webhook:", err.message);
    res.status(400).send(`Erro no Webhook: ${err.message}`);
  }
};

function handlePaymentIntentCreated(paymentIntent) {
  console.log("PaymentIntent criado:", paymentIntent.id);
}

function handlePaymentIntentFailed(paymentIntent) {
  console.log("Pagamento falhou para PaymentIntent:", paymentIntent.id);
}

function handlePaymentIntentSucceeded(paymentIntent) {
  console.log("Pagamento bem-sucedido para PaymentIntent:", paymentIntent.id);
}

module.exports = {
  createPaymentIntent,
  webhook,
  checkPaymentStatus,
  getPaymentStatus,
};
