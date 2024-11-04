// controllers/authController.js
const axios = require('axios');
const eupagoConfig = require('../config/eupagoConfig');

let authToken = null; // Token armazenado para uso nas requisições

// Função para autenticar e obter o token usando Client ID e Client Secret
const authenticate = async () => {
  console.log("Client ID:", eupagoConfig.clientId);
  console.log("Client Secret:", eupagoConfig.clientSecret);

  try {
    const response = await axios.post(
      `${eupagoConfig.apiUrl}/auth/token`,
      null, // Adicione null para o corpo vazio
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${eupagoConfig.clientId}:${eupagoConfig.clientSecret}`).toString('base64')}`,
        },
      }
    );
    
    authToken = response.data.token; // Armazena o token
    console.log("Token recebido:", authToken); // Adicione esse log para verificar o token
    return authToken;
  } catch (error) {
    console.error('Erro ao autenticar com a Eupago:', error.message);
    throw new Error('Autenticação falhou');
  }
};

// Função para acessar o token autenticado
const getAuthToken = () => authToken;

module.exports = { authenticate, getAuthToken };
