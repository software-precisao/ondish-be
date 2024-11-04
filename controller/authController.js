// controllers/authController.js
const axios = require('axios');
const eupagoConfig = require('../config/eupagoConfig');

let authToken = null; // Token armazenado para uso nas requisições

// Função para autenticar e obter o token usando Client ID e Client Secret
const authenticate = async () => {
  console.log(eupagoConfig.clientId, eupagoConfig.clientSecret);
  try {
    const response = await axios.post(`${eupagoConfig.apiUrl}/auth/token`, {
      clientId: eupagoConfig.clientId,
      clientSecret: eupagoConfig.clientSecret,


      
    });
    authToken = response.data.token; // Armazena o token
    return authToken;
  } catch (error) {
    console.error('Erro ao autenticar com a Eupago:', error.message);
    throw new Error('Autenticação falhou');
  }
};

// Função para acessar o token autenticado
const getAuthToken = () => authToken;

module.exports = { authenticate, getAuthToken };
