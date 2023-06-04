const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();
// const redis = require('async-redis');

// tạo Redis client instance
// const client = redis.createClient({
//     password: process.env.REDIS_PASSWORD,
//     socket: {
//         host: process.env.REDIS_HOST,
//         port: process.env.REDIS_PORT
//     }
// });
// const client = redis.createClient({
//   url: process.env.REDIS_URL,
// });
// // kết nối tới Redis server
// client.on("connect", () => {
//   console.log("Connected to Redis server");
// });

// client.on("error", (err) => {
//   console.error(err);
// });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set('strictQuery', true)

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB database");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
