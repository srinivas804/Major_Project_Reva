const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

const userRouter = require("./routes/user");

const corsOptions = {
  origin: ["http://127.0.0.1:5501", "http://127.0.0.1:5500"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

// link routes
app.use("/user", userRouter);
const port = 4003;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./routes/index.html"));
});

app.listen(port, () => {
  console.log(`Server is up at ${port}`);
});
