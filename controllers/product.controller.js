import { createProductService, getProductService, updateProductService, deleteProductService } from "../service/product.service.js";


export async function createProductController(req, res) {
    try{
        const product = await createProductService(req.body);

        res.status(201).json({
            message: " product created successfully",
            product
        });
    } catch(err) {
        res.status(400).json({
            error : err.message
        });
    }
}


export async function getProductController(req, res) {
    try{
        const { id } = req.params;
        const product = await getProductService(id); 
     res.status(201).json(product);
   
    } catch(err) {
        res.json(404).json({
            error: err.message
        });
    }
}

export async function updateProductController(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await updateProductService({ id, updates });

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
}

export async function deleteProductController(req, res, next) {
  try {
    const { id } = req.params;
    await deleteProductService(id);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
