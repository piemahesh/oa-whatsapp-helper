// WhatsApp Configuration

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
console.log("==========================");
console.log(WHATSAPP_ACCESS_TOKEN);
console.log(" WHATSAPP_PHONE_NUMBER_ID");
console.log(WHATSAPP_PHONE_NUMBER_ID);
const WHATSAPP_CONFIG = {
  baseURL: `https://graph.facebook.com/v18.0`,
  phoneNumberId: WHATSAPP_PHONE_NUMBER_ID,
  accessToken: WHATSAPP_ACCESS_TOKEN,
};

module.exports = { WHATSAPP_CONFIG };
