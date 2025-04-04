require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: message }] }]
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

