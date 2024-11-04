


module.exports = {
    clientId: '8a418e1ffae44794b329285e84ac2958',
    clientSecret: '8229382cd50243bd877001e0b93dc74b',
    environment: process.env.NODE_ENV || 'sandbox', // 'sandbox' ou 'production'
    get apiUrl() {
      return this.environment === 'production'
        ? 'https://clientes.eupago.pt/api'
        : 'https://sandbox.eupago.pt/api';
    },
  };
  