import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import expenseRoutes from './routes/expenseRoutes.js'; // ✅ make sure this path is correct
import ocrRoutes from './routes/ocrRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Use the API route correctly
app.use('/api/expenses', expenseRoutes);
app.use('/api/ocr', ocrRoutes);

const PORT = process.env.PORT || 8978;
app.listen(PORT, () => console.log(`spLITTY backend running on port ${PORT}`));
