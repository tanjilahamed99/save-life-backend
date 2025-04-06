import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import winston from 'winston';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { orderRoutes } from './routes/order.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import { userRoutes } from './routes/user.routes.js';
import { emailRoutes } from './routes/email.routes.js';
import { AdminModel } from './models/admin.model.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Cors
// Cors

app.use(
  cors({
    origin: [
      'https://benzobestellencom.vercel.app',
      'http://localhost:3000',
      'https://admin-panel-benzo.vercel.app',
    ],
    credentials: true,
  })
);

// Logger setup
winston.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  })
);

app.get('/', (req, res) => res.send('Medicine Store API'));

// Routes

// auth route
app.use('/api/v1/auth', authRoutes);

// Orders routes
app.use('/api/v1/orders', orderRoutes);

// user routes
app.use('/api/v1/users', userRoutes);

// email routes
app.use('/api/v1/email', emailRoutes);

const existAdmin = await AdminModel.findOne({ email: 'admin@gmail.com' });
// Hash password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash('admin1234@', salt);
if (!existAdmin) {
  await AdminModel.create({
    name: 'Admin',
    email: 'admin@gmail.com',
    password: hashedPassword,
  });
}

// Error handling
app.use((err, req, res, next) => {
  winston.error(err.message);
  res.status(201).send('Something went wrong');
});

// 404 Route
app.use('*', (req, res) => res.send('404 Not Found'));

app.listen(port, () => `Server running on port ${port}`);
