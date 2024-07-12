const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const express = require('express');

const app = express();

// Servir arquivos estáticos


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Ondish',
      version: '1.0.0',
      description: 'Documentação da API do projeto do Ondish',
      contact: {
        email: 'ragner@softwareprecisao.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
      {
        url: 'https://ondish.webserverapi.online/api',
        description: 'Servidor de Produção',
      },
    ],
  },
  apis: ['./routes/*.js'], // Caminho para os arquivos de rotas
};

const specs = swaggerJsdoc(options);


module.exports = {
  swaggerUi,
  specs,
};