import express from 'express';
import { createProduct, deleteProduct, getProductId, getProducts, getProductsBySearch, updateProduct } from '../controllers/productController.js';

const productRouter = express.Router();


productRouter.get("/search/:query", getProductsBySearch);

productRouter.get("/", getProducts);
productRouter.post("/", createProduct);
productRouter.get("/:productID", getProductId);
productRouter.put("/:productID", updateProduct);
productRouter.delete("/:productID", deleteProduct);



export default productRouter; 