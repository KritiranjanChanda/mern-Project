import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; 
import { connectDB } from './config/db.js';
import productRoutes from './routes/product.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Connect to the database
connectDB();

// ✅ CORS Middleware
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

// ✅ Middleware to parse JSON data
app.use(express.json());

// ✅ API Routes
app.use("/api/products", productRoutes);

// ✅ Serve Frontend in Production Mode
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../frontend/dist');
    app.use(express.static(frontendPath));

    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running...");
    });
}

// ✅ Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
