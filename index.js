const express = require("express");
const app = express();

const PORT = process.env.PORT || 1000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Server is alive");
});

app.get("/webhook", (req, res) => {
  console.log("🔍 GET /webhook hit");
  res.send("Webhook GET working");
});

app.post("/webhook", (req, res) => {
  console.log("📩 POST /webhook hit");
  console.log(req.body);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
