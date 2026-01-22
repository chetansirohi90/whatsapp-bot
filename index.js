const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// Verification Token (jo aapne webhook setup me dala)
const VERIFY_TOKEN = "myWhatsappBotToken";

// Webhook endpoint for WhatsApp
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified ✅");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Receive messages
app.post("/webhook", async (req, res) => {
  const data = req.body;

  if (data.object) {
    const messages = data.entry[0].changes[0].value.messages;
    if (messages) {
      for (let msg of messages) {
        const from = msg.from;
        const text = msg.text ? msg.text.body : "";

        console.log("Message from:", from, "Text:", text);

        // Auto-reply logic
        await axios.post(
          `https://graph.facebook.com/v16.0/1006019942587201/messages`,
          {
            messaging_product: "whatsapp",
            to: from,
            text: { body: `You said: ${text}` },
          },
          {
            headers: { Authorization: `Bearer EAAKZCt34b5QsBQnHbok5bAqDfhvocDUymoIyIoyhziCFLHZAbPLSr8qwjlzINLmfGZCfyG7tZAHJOQcAz20cdFwXf0wIcKZCS6Pbv2xe6d2BqMCfJboWq0EwcxfCvFhdi7pSi81YmegjtF37lLuM9cwiGOobbFZAHwNqTamyy0ikb4yNKwJR201udUDyoRWFVlaZAjSYXo59HSJYlKmCdbtTWZBw828Q0SZAy9ZAzlxFjZBTZCIflYUf15YuTGE0VKfZAMKHgqBWLKMrVGeAQxZCZBZCaBPy` },
          }
        );
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
