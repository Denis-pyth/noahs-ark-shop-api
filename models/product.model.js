import pool from "../db/db.js";


export async function createProduct({ name, description, price, stock, image_url}) {
    const query = `
    INSERT INTO products (name, description, price, stock, image_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `;
    const values = [name, description, price, stock, image_url];
    const { rows } = await pool.query(query, values);
    return rows[0];
}


export async function getProductById(Id, client = pool) {
    const query = ` SELECT * FROM products WHERE id = $1 and is_active = true  `;
    const { rows } = await pool.query(query, [Id]);
    return rows[0];
}   

export async function updateProduct({ id, updates }) {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in updates) {
    fields.push(`${key} = $${index}`);
    values.push(updates[key]);
    index++;
  }

  values.push(id);

  const query = `
    UPDATE products
    SET ${fields.join(", ")}
    WHERE id = $${index} AND is_active = true
    RETURNING *
  `;

  const { rows } = await pool.query(query, values);
  return rows[0];
}


export async function updateProductStock( {quantity, Id}) {
    const query = `
    UPDATE products
    SET stock = stock - $1  
    WHERE id = $2 and stock >= $1
    RETURNING *
    `;
    const  { rows }  = await pool.query( query, [quantity, Id]);
    return rows[0]
    
}

export async function deleteProduct(id) {
  const query = `
    UPDATE products
    SET is_active = false
    WHERE id = $1
    RETURNING *
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
}
