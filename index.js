const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔑 SAME token Meta dashboard me dalna hai
const VERIFY_TOKEN = "test123";

// git commit -m "Initial WhatsApp bot setup"===============================
// ✅ WEBHOOK VERIFY (GET)
// ===============================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified successfully");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Webhook verification failed");
    res.sendStatus(403);
  }
});

// ===============================
// ✅ RECEIVE MESSAGE (POST)
// ===============================
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const text = message.text?.body || "";

    console.log("📩 Message from:", from);
    console.log("💬 Text:", text);

    // 🔁 Auto reply
    await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.1006019942587201}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: {
          body: `👨‍⚕️ *Dr. Sharma Clinic*\n\nNamaste 🙏\n\nClinic Timings:\n🕘 9 AM – 1 PM\n🕕 6 PM – 9 PM\n\n📍 Location: Sector 62, Noida\n📞 Appointments ke liye reply karein "APPOINTMENT"\n\n— Auto Assistant`
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.EAAKZCt34b5QsBQnHbok5bAqDfhvocDUymoIyIoyhziCFLHZAbPLSr8qwjlzINLmfGZCfyG7tZAHJOQcAz20cdFwXf0wIcKZCS6Pbv2xe6d2BqMCfJboWq0EwcxfCvFhdi7pSi81YmegjtF37lLuM9cwiGOobbFZAHwNqTamyy0ikb4yNKwJR201udUDyoRWFVlaZAjSYXo59HSJYlKmCdbtTWZBw828Q0SZAy9ZAzlxFjZBTZCIflYUf15YuTGE0VKfZAMKHgqBWLKMrVGeAQxZCZBZCaBPy}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.sendStatus(500);
  }
});

// ===============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
