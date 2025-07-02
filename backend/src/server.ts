import express from 'express';
import cors from 'cors'; 
import authRoutes from './routes/authRoutes';
import businessCardRoutes from './routes/businessCardRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// API routes
app.use('/api/business-card', businessCardRoutes);
app.use('/api/auth', authRoutes); 

// Global error handler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
