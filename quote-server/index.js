// quote-server/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();

// Allow local dev (Expo/Web/anything). For tighter control, list origins instead.
// quote-server/index.js
app.use(cors({ origin: ["https://daily-motivational-quotes.vercel.app", "http://localhost:5173"] }));
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get('/quote', async (req, res) => {
  try {
    const mood = (req.query.mood || 'neutral').toString();
    const prompt =
      `Give me a short, meaningful, original quote for someone who is feeling ${mood}. ` +
      `Make it poetic and encouraging. Keep it under 25 words.`;

    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',        // use 'gpt-4o-mini' or 'gpt-4o' if you have access
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9
    });

    const quote =
      completion.choices?.[0]?.message?.content?.trim() ||
      'Keep going. Your next step matters most.';

    res.json({ quote });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate quote' });
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () =>
  console.log(`✅ Quote server running on http://localhost:${port}`)
);
