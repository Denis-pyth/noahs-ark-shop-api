import express from 'express';
import authRoutes from "./routes/auth.route.js";
import ordersRoutes from "./routes/orders.route.js";
import productRoutes from "./routes/product.route.js"
import { authJwt } from './middleware/authJwt.js';
import { errorHandler } from './middleware/errorHandler.js';
import dotenv from 'dotenv';
import { initializeDB } from './db/db.js';

const app = express();
dotenv.config();

initializeDB();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authJwt());
app.use('/api/auth', authRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
});






app.use(errorHandler);



