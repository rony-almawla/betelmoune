import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupSocketIO } from './middleware/socketHandler.js';

// Import routers
import userRouter from './routes/userRoutes.js';
import workshopRouter from './routes/workshopRoutes.js';
import productsRouter from './routes/productRoutes.js';
import messagesRouter from './routes/messageRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import cartRouter from './routes/cartRouter.js';
import chartRouter from './routes/chartRoutes.js';
import chatsRouter from './routes/chatRoutes.js';
import reqProductRouter from './routes/reqProductRoutes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

console.log('url::', process.env.MONGO_ATLAS);

const app = express();
const server = http.createServer(app);

mongoose
  .connect(process.env.MONGO_ATLAS)
  .then(() => console.log('connected to db!'))
  .catch((err) => {
    console.log(err.message);
  });

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  Credential: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = setupSocketIO(server);

app.use('/api/users', userRouter);
app.use('/api/workshops', workshopRouter);
app.use('/api/products', productsRouter);
app.use('/api/messages', messagesRouter);
app.use('/backend/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/charts' , chartRouter);
app.use('/api/chats', chatsRouter);
app.use('/api/requestProducts', reqProductRouter);



app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
