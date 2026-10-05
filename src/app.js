const express = require("express");

const app = express();

const cookie = require("cookie-parser");

const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/accounts.routes");
const transactionRouter = require("./routes/transaction.routes");
const systemTransferRouter = require("./routes/initial_Funds.routes");

app.use(express.json());
app.use(cookie());



app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/system", systemTransferRouter);

module.exports = app;
