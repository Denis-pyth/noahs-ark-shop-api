import express from 'express';
import dotenv from 'dotenv';
import { initRedis } from './config/redis.js';
import authRoutes from "./routes/auth.route.js";
import ordersRoutes from "./routes/orders.route.js";
import productRoutes from "./routes/product.route.js";
import adminRoutes from "./routes/admin.route.js";
import { jwtAuth } from './middleware/authJwt.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initializeDB } from './db/db.js';
import { validateSession } from './middleware/session.js';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import YAML from 'yamljs';

const app = express();
dotenv.config();

initializeDB();

const PORT = process.env.PORT || 3000;
await initRedis(); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const swaggerPath = path.join(__dirname, 'docs', 'swagger.yaml');
console.log('Swagger file path:', swaggerPath);

if (!fs.existsSync(swaggerPath)) {
    console.error(' Swagger file not found at:', swaggerPath);
} else {
    console.log(' Swagger file found at:', swaggerPath);
}

const swaggerDocument = YAML.load(swaggerPath);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(jwtAuth);
app.use(validateSession);
app.use('/api/auth', authRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/products", productRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
});






app.use(errorHandler);



