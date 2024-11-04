module.exports = {
  clientId: process.env.API_KEY,
  clientSecret: process.env.CLIENT_SECRET,
  apiKey: process.env.API_KEY,
  environment: process.env.NODE_ENV || "sandbox",
  get apiUrl() {
    return this.environment === "production"
      ? process.env.URL_PROD
      : process.env.URL_SANDBOX;
  },
};
