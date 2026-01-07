import express from 'express';
import { isAdmin } from '../middleware/isAdmin.js';
import { authJwt } from '../middleware/authJwt.js';
import { cancelOrderController, createOrderController, getOrderController, getUserOrdersController, getAllOrdersController, updateOrderStatusController } from '../controllers/order.controller.js';

const router = express.Router();

//user routes
router.post(
  "/",
  authJwt(),
  createOrderController
);
router.get(
    "/:id",
    authJwt(),
    getOrderController
);
router.get(
  "/",
  authJwt(),
  getUserOrdersController
);

router.put(
  "/:id/cancel",
  authJwt(),
  cancelOrderController
);

//Admin routes
router.get("/admin", authJwt(), isAdmin, getAllOrdersController);
router.put("/admin/:id", authJwt(), isAdmin, updateOrderStatusController);

export default router;


