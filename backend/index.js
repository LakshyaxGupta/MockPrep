require("dotenv").config(); // ✅ Load env variables

const express = require("express");
const http = require("http");
const cors = require("cors");
const questionsRoute = require("./routes/questions.route");
const authRoute = require("./routes/auth.route");
const quizRoute = require("./routes/quiz.route");
const connectToMongo = require("./connectDb");
const { initializeSocket } = require("./socket/socket.js");

const PORT = process.env.PORT || 3000; // ✅ Use process.env directly

const app = express();
const server = http.createServer(app);
const socketIO = require("socket.io");

// Initialize socket.io
const io = socketIO(server, {
  cors: {
    origin: "*", // allow all for now (you can restrict later)
    credentials: true,
  },
  transports: ["websocket"],
});

// Connect to MongoDB
connectToMongo();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

// Routes
app.use("/api/v1/questions", questionsRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/quiz", quizRoute);
app.use("/uploads", express.static("uploads"));

// Socket setup
initializeSocket(io);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Test route
app.get("/", (req, res) => {
  res.send("hello from simple server :)");
});
