const axios = require("axios");
const { authenticate, getAuthToken } = require("./authController");
const eupagoConfig = require("../config/eupagoConfig");
const Stripe = require("stripe");
const dotenv = require("dotenv");

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.calculateOrderAmount = (items) => {
  let total = 0;
  items.forEach((item) => {
    total += item.price * item.quantity;
  });
  return total * 100;
};

exports.createPaymentIntent = async (req, res) => {
  const { items } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "eur",
      payment_method_types: ["card"],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Erro ao criar PaymentIntent:", error);
    res
      .status(500)
      .send({ mensagem: "Erro ao criar PaymentIntent", error: error.message });
  }
};

exports.createMBWayPayment = async (req, res) => {
  const { amount, phoneNumber, id } = req.body;

  try {
    let token = getAuthToken();
    if (!token) {
      token = await authenticate();
    }
    const response = await axios.post(
      `${eupagoConfig.apiUrl}/mbway/create`,

      {
        amount,
        phoneNumber,
        id,
      },

      {
        headers: {
          ApiKey: eupagoConfig.apiKey,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await authenticate();
      return exports.createMBWayPayment(req, res);
    }
    res.status(500).json({ error: error.message });
  }
};

exports.createMultibancoReference = async (req, res) => {
  const { amount, reference, description, expirationDate } = req.body;

  try {
    let token = getAuthToken();
    if (!token) {
      token = await authenticate();
    }

    const response = await axios.post(
      `${eupagoConfig.apiUrl}/multibanco/create`,
      {
        amount,
        reference,
        description: description || `Pagamento do cliente ${reference}`,
        expirationDate: expirationDate || null,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ApiKey: eupagoConfig.apiKey, // Inclui ApiKey aqui
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await authenticate();
      return exports.createMultibancoReference(req, res);
    }
    res.status(500).json({ error: error.message });
  }
};

exports.getPaymentStatus = async (req, res) => {
  const { trid } = req.params;

  try {
    let token = getAuthToken();
    if (!token) {
      token = await authenticate();
    }

    const response = await axios.get(
      `${eupagoConfig.apiUrl}/payouts/transactions/${trid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ApiKey: eupagoConfig.apiKey, // Inclui ApiKey aqui
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await authenticate();
      return exports.getPaymentStatus(req, res);
    }
    res.status(500).json({ error: error.message });
  }
};

exports.getPaymentsByDateRange = async (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res
      .status(400)
      .json({ message: "As datas start_date e end_date são obrigatórias." });
  }

  try {
    let token = getAuthToken();
    if (!token) {
      token = await authenticate();
    }

    const response = await axios.get(`${eupagoConfig.apiUrl}/payouts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        ApiKey: eupagoConfig.apiKey, // Inclui ApiKey aqui
      },
      params: {
        start_date,
        end_date,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await authenticate();
      return exports.getPaymentsByDateRange(req, res);
    }
    res.status(500).json({ error: error.message });
  }
};
