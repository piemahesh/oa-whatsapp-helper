module.exports = {
  // Configuration constants
  REGION: "asia-south1",
  MONGO_URI: `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.2idklaw.mongodb.net/ecommerce`,
  MONGO_OPTIONS: { maxPoolSize: 20 }, // Connection Pooling
};

// mongodb+srv://OA:ocean000@cluster0.2idklaw.mongodb.net/ecommerce
