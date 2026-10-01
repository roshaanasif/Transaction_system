const express = require("express");

const app = express();

const cookie = require("cookie-parser");

const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/accounts.routes");

app.use(express.json());

app.use(cookie());



app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);

module.exports = app;
