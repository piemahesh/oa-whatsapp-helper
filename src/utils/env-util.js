const isProduction = () => process.env.NODE_ENV === "prod";

const isDev = () => process.env.NODE_ENV === "dev";

const isTest = () => process.env.NODE_ENV === "test";

module.exports = {
  isProduction,
  isDev,
  isTest,
};
