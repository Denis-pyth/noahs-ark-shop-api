import pg from "pg";
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
    user : process.env.PG_USER,
    host : process.env.PG_HOST,
    database : process.env.PG_DATABASE,
    password : process.env.PG_PASSWORD,
    port : process.env.PG_PORT

});




async function initializeDB() {
  try{
    await pool.query('SELECT NOW()');
    console.log("PostgreSQL connection established successfully")
    
    const createUsersTable= ` 
    CREATE TABLE IF NOT EXISTS users  (
        id SERIAL PRIMARY KEY,
         email VARCHAR(255) UNIQUE NOT NULL,
         password_hash VARCHAR(255)  NOT NULL,
         phone VARCHAR(20),
         is_admin BOOLEAN DEFAULT false,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     )
     `;
    const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
        id serial primary key,
        name TEXT NOT NULL,
        brand VARCHAR(200),
        price NUMERIC(10,2) NOT NULL,
        stock INT NOT NULL CHECK(stock >= 0),
        description TEXT,
        is_active BOOLEAN DEFAULT false,
        image_url TEXT,
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `; 
    const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
        id serial primary key,
        user_id INT NOT NULL, 

        status VARCHAR(50) NOT NULL DEFAULT 'pending',

        totalPrice Numeric(10,2) NOT NULL,
        country TEXT,
        zip INT,
        city TEXT NOT NULL,
        shipping_address1 VARCHAR(255) NOT NULL,
        shipping_address2 VARCHAR(255),
        date_ordered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE Cascade
    )
    `;
    const createOrderItemsTable = `
   CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL CHECK(QUANTITY > 0),
        price_at_purchase NUMERIC(10,2) NOT NULL,

        CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE Cascade,

        CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
   ) 
    `;
    await pool.query(createUsersTable)
    await pool.query(createProductsTable)
    await pool.query(createOrdersTable)
    await pool.query(createOrderItemsTable)
    console.log("Database Initialized");
    
  } catch(error) {
    console.error("Error connecting or initializing the Database:", error.message
    );
    process.exit(1);
  }

}




  export default pool;
  export { initializeDB };