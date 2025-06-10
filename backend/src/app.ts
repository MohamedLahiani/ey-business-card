import express from 'express';
import businessCardRoutes from './routes/businessCardRoutes';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('EY Business Card Backend is running!');
});

app.use('/api/business-card', businessCardRoutes);

export default app;




// This is the main application file for the EY Business Card Backend.
// It sets up the Express application, configures middleware, and defines routes.