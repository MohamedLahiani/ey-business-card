import express from 'express';
import businessCardRoutes from './routes/businessCardRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware for parsing JSON requests
app.use(express.json());

// Use the business card routes
app.use('/api/business-card', businessCardRoutes);

// Use the error handler middleware
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});