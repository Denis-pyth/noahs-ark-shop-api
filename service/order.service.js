import pool from "../db/db.js";
import { cancelorder, createOrder, getOrder, getUserOrders, updateOrderStatus, getAllOrders } from "../models/order.model.js";
import { createOrderItem } from "../models/orderItem.model.js";
import { getProductById, updateProductStock } from "../models/product.model.js";


export async function userOrder( { userId, items, shippingAddress } ) {
    if(!userId) {
        throw new Error('user must be authenticated!');
    }
    if(!items|| items.length === 0 ){
        throw new Error ("order must contain at least one item");
    }

    const client = await pool.connect();
    try {
    await client.query("BEGIN");
    let totalPrice = 0;

    for ( const item of items) {
        const product = await getProductById(item.productId, client);
        if(!product){
            throw new Error("product not found.");
        }
        if(product.stock < item.quantity){
            throw new Error("stock not found");
        }

        totalPrice += product.price * item.quantity;
    }

    const order = await createOrder({
        userId,
        totalPrice
    });

    for(const item of items){
        const product = await getProductById(item.productId, client);
        await createOrderItem({
            orderId: order.id,
            productId: product.id,
            price : product.price,
            quantity : item.quantity
        });
        await updateProductStock(product.id, item.quantity);
    }
    await client.query("COMMIT");
    return order;
    } catch (err){
      await client.query("ROLLBACK");
      throw err;

    } finally{
        client.release();
    }

}

export async function getOrderService ({ orderId, userId}) {
    if(!orderId){
        throw new Error("order id is required!");
    }

    if(!userId){
        throw new Error("Unauthorized!");
    }
    
    const order = await getOrder({orderId, userId});
    if(!order){
        throw new Error("order not found");
    }

    return order;
}  

export async function getUserOrdersService(userId){
    if(!userId){
        throw new Error('Unauthorized!');
    }

    return await getUserOrders(userId);

}

export async function cancelOrderService({orderId, userId}){
    if(!orderId){
        throw new Error('order id required');
    }

    if(!userId){
        throw new Error('Unauthorized!');
    }

    const order = await cancelorder({ orderId, userId});
    if(!order){
        throw new Error('order can not be cancelled!');
    }
    return order;
}


const ALLOWEDSTATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

export async function updateOrderStatusService({ orderId, status}) {
    if(!orderId){
        throw new Error("order ID is required!");
    }

    if(!ALLOWEDSTATUSES.includes(status)){
        throw new Error("Invalid order status");
    }

    const order = await updateOrderStatus({orderId, status});
    if(!order){
        throw new Error("order not found!");
    }
    return order;
}

export async function getAllOrdersService({ userId, page, limit }) {
  if (!userId) throw new Error("Unauthorized");

  return await getAllOrders({ userId, page, limit });
}
