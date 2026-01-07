import pool from "../db/db.js";

export async function createOrderItem({ orderId, productId, price, quantity}) {
    const query = `
   INSERT INTO order_items (order_id, product_id, price_at_purchase, quantity)
   VALUES ($1, $2, $3, $4)
   RETURNING id, order_id, product_id, price_at_purchase, quantity
    `;

    const values = [orderId, productId, price, quantity];
    const { rows } = pool.query(query, values);
    return rows[0];
}