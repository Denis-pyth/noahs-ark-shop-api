import { createProduct, getProductById, updateProduct, deleteProduct } from "../models/product.model.js";



export async function createProductService(data) {
    const {  name, description, price, stock, image_url} = data;
    if(!name || !price ) {
        throw new Error("Name and Price are required!");
    }

    if (price <= 0) {
        throw new Error(" Price must be greater than zero!");
    }

    if(stock < 0 ){
        throw new Error(" stock cannot be negative!");
    }

    const product = await createProduct({
         name,
         description,
         price, 
         stock,
         image_url

    });
    return product;
}

export async function getProductService(productId){
    if(!productId){
        throw new Error(" Product id required!");
    }
    const product = await getProductById(productId);
    if(!product){
        throw new Error(" Product not found!");
    }
    return product;
}

export async function updateProductService({ id, updates }) {
  if (!id) {
    throw new Error("Product ID is required");
  }

  const product = await updateProduct({ id, updates });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

export async function deleteProductService(id) {
  const product = await deleteProduct(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

