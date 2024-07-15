const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items) => {
  // Substitua este cálculo pelo cálculo real do valor do pedido
  let total = 0;
  items.forEach(item => {
    total += item.price * item.quantity;
  });
  return total * 100; // Converter para centavos
};

const createPaymentIntent = async (req, res) => {
  const { items } = req.body;

  try {
    // Criar um PaymentIntent com o valor do pedido e a moeda
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Erro ao criar PaymentIntent:', error);
    res.status(500).send({ mensagem: 'Erro ao criar PaymentIntent', error: error.message });
  }
};

module.exports = {
  createPaymentIntent,
};