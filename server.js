import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logUserHandler from './controllers/logUser.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Route bảo mật (khó đoán)
app.post('/v1/bot/hh3d/abc123/log-user', logUserHandler);

app.get('/', (req, res) => {
  res.send('🚀 HH3D BOT API IS RUNNING!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
