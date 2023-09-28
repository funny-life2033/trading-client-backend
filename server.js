require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authRoute");

connectDB();

const app = express();

let corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cookieParser);
app.use(express.json());
app.use(cors(corsOptions));

app.use("/auth", authRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server is running on port ${PORT}`)
);
