const express = require("express");
const app = express();
const PORT = 5000;

messageRouter = require("./routes/message");
app.use("/messages", messageRouter);
app.get("/", (req, res) => {
  res.json({ message: "Welcome to home route!" });
});

app.listen(PORT, () => console.log(`Running server on Port ${PORT}`));
