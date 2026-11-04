import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 AUTOX Backend API Engine Online`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Port: http://localhost:${PORT}`);
    console.log(`📑 Health Endpoint: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
}).catch(err => {
  console.error(`[Server Start Error]: ${err.message}`);
  process.exit(1);
});
