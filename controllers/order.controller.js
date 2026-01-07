import { getOrderService, userOrder, getUserOrdersService, cancelOrderService, getAllOrdersService, updateOrderStatusService } from "../service/order.service.js";

//Create order
export async function createOrderController( req, res) {
    const userId = req.auth.userId;
    const { items, shippingAddress } = req.body;

    const order = await userOrder({userId, items, shippingAddress});
    
    res.status(201).json(order);
}

//GET order by id
export async function getOrderController(req, res, next){
   try{ 
    const userId = req.auth.userId;
    const { id } = req.params;

    const order = await getOrderService({ orderId: id, userId});

    res.status(200).json(order);
   } catch(err) {
    next(err);
   }
}

// GET USER ORDERS
export async function getUserOrdersController(req, res, next) {
  try {
    const userId = req.auth.userId;

    const orders = await getUserOrdersService(userId);

    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
}

// CANCEL ORDER
export async function cancelOrderController(req, res, next) {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;

    const order = await cancelOrderService({ orderId: id, userId });

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
}



//GET order status
export async function updateOrderStatusController(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await updateOrderStatusService({
      orderId: id,
      status
    });

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
}

//GET all orders

export async function getAllOrdersController(req, res, next) {
  try {
    const userId = req.auth.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const orders = await getAllOrdersService({ userId, page, limit });

    res.status(200).json({
      page,
      limit,
      orders
    });
  } catch (err) {
    next(err);
  }
}



