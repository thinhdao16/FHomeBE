const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postingRoutes = require("./routes/postingRoutes");
const roomRoutes = require("./routes/roomRoutes");
const buildingRoutes = require("./routes/buildingRoutes");
const notiRoutes = require("./routes/notiRoutes");
const postingCommentRoutes = require("./routes/postingCommentRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");
const pointRoutes = require("./routes/pointRoutes")
const testRoutes = require("./routes/testRoute");
const imageRoutes = require("./routes/imageRoutes")
app.use(cors());

// Set up Swagger UI
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// Call setSwaggerUI to set up Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Body parser middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up routes

app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/posts", postingRoutes);
app.use("/", roomRoutes);
app.use("/", buildingRoutes);
app.use("/", notiRoutes);
app.use("/", postingCommentRoutes);
app.use("/", favouriteRoutes);
app.use("/", pointRoutes)
app.use("/test", testRoutes);
app.use("/", imageRoutes)

// Set up error handling middleware
// app.use(errorHandler);

module.exports = app;
