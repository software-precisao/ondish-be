const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const processPayment = async (req, res) => {
  const { id_pedido, valor_total, nome, email, cardNumber, expMonth, expYear, cvc } = req.body;

  try {
    // Criar um token de cartão
    const token = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: cvc,
      },
    });

    // Criar um cliente no Stripe
    const customer = await stripe.customers.create({
      name: nome,
      email: email,
      source: token.id,
    });

    // Criar um pagamento com o Stripe
    const charge = await stripe.charges.create({
      amount: Math.round(valor_total * 100), // Converter para centavos
      currency: 'eur', // Usar euros
      customer: customer.id,
      description: `Pagamento para o pedido ${id_pedido}`,
    });

    // Aqui você pode atualizar o status do pedido no banco de dados

    res.status(200).send({
      mensagem: 'Pagamento realizado com sucesso!',
      chargeId: charge.id,
      chargeStatus: charge.status,
    });
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    res.status(500).send({ mensagem: 'Erro ao processar pagamento', error: error.message });
  }
};

module.exports = {
  processPayment,
};