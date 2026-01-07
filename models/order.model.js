import pool from "../db/db.js";

export async function createOrder({userId, totalPrice, status}) {
    const query = `
      INSERT INTO orders (user_id,total_Price, status )
      VALUES ($1, $2, 'pending') 
      RETURNING id, user_id, status, total_Price, created_at
    `;
    const values = [userId, totalPrice, status];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

export async function getOrder({ orderId, userId}) {
  const query = `
  SELECT * FROM orders
  WHERE id = $1 and user_id = $2
  `;
  const { rows } = await pool.query(query, [orderId, userId]);
  return rows [0];
}

export async function getUserOrders(userId) {
  const query = `
  SELECT *
  FROM orders
  WHERE user_id = $1
  ORDER BY date_ordered DESC
  `;
  const { rows } = await pool.query(query,[userId]);
  return rows[0];
}

export async function cancelorder({ orderId, userId}) {
  const query = `
    UPDATE orders
    SET status = 'cancelled'
    WHERE id = $1
     AND user_id = $2
     AND status = 'pending'
     RETURNING *
  `;
  const { rows } = await pool.query(query, [orderId, userId]);
  return rows[0];
}



export async function updateOrderStatus({ orderId, status }) {
  const query = `
    UPDATE orders
    SET status = $1
    WHERE id = $2
    RETURNING *
  `;

  const { rows } = await pool.query(query, [status, orderId]);
  return rows[0];
}

export async function getAllOrders({ userId, page = 1, limit = 10 }) {
  const offset = (page - 1) * limit;

  const query = `
    SELECT *
    FROM orders
    WHERE user_id = $2
    ORDER BY date_ordered DESC
    LIMIT $2 OFFSET $3
  `;

  const { rows } = await pool.query(query, [ limit, offset]);
  return rows;
}


