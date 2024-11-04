// controllers/paymentController.js
const axios = require('axios');
const { authenticate, getAuthToken } = require('./authController');
const eupagoConfig = require('../config/eupagoConfig');

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
          Authorization: `Bearer ${token}`,
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
        description: description || `Pagamento do cliente ${reference}`, // Define uma descrição padrão, se não vier no body
        expirationDate: expirationDate || null, // Expiração opcional
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, 
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



