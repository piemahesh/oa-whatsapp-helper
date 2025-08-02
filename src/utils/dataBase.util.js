const { isProduction } = require("./env-util");

module.exports = {
  // Database constants
  getDatabaseName: () => (isProduction() ? "OA_Enquiry" : "OA_Enquiry_Test"),
};
