import express from 'express';
import { createProduct, deleteProduct, getProduct, getProductId, updateProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get("/",getProduct)
productRouter.post("/",createProduct)
productRouter.get("/search", (req, res)=>{
    res.json({
        message : "Searching!!"
    })
})
// id valin weda karan eva anith eva demmat passe danna
productRouter.delete("/:productID",deleteProduct)// /: productID -> / me line ekt pitipassem body ekk danne nathuv adala id ek vithrak local host ekath ekk evann
productRouter.put("/:productID",updateProduct)
productRouter.get("/:productID", getProductId)

productRouter.get("/search", (req, res)=>{
    res.json({
        message : "Searching!!"
    })
})

export default productRouter; 