import express from 'express';
import { isAdmin } from '../middleware/isAdmin.js';
import { authJwt } from '../middleware/authJwt.js';
import { createProductController, deleteProductController, getProductController, updateProductController} from '../controllers/product.controller.js';

const router = express.Router();

//public
router.get(
    "/",
    authJwt,
    getProductController
);
router.get(
    "/:id",
    authJwt,
    getProductController
);

//admin only 
router.post(
  "/",
  authJwt(),
  isAdmin,
  createProductController
);

router.put(
    "/:id",
    authJwt(),
    isAdmin,
    updateProductController
);

router.delete(
    "/:id",
    authJwt(),
    isAdmin,
    deleteProductController,
);

export default router;
