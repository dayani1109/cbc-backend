import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req, res){

    if (!isAdmin(req)){
        res.status(403).json({
            message:"you are not authorized to create a product"
        });
        return;
    }

    try{
        const productData = req.body;

        const product = new Product(productData)

        await product.save()

        res.json({
            message : "Product created successfully",
            product : product
    });

    }catch(err){
        
        console.error(err);
        res.status(500).json({
            message : "failed to create product",
        });
    }

}

export async function getProduct(req, res){
    try{
        const products = await product.find()
        res.json(products);

    }catch(err){
        console.error(err);
        res.status(500).json({
            message : " failed to retrieve products",
        });

    }
}

export async function deleteProduct(req, res){
    
     if (!isAdmin(req)){
        res.status(403).json({
            message:"you are not authorized to create a product"
        });
        return;
    }
    
    try{
        const productID = req.body.productID

        if(productID ==  null){//product id ekak thibbe nathi unoth
            res.status(400).json({
                message : "Product Id is required"
            });
            return;
        }

        await Product.deleteOne({
            productID : productID
        })

        res.json({
            message : "Product delete successfully"
        });

    }catch(err){
        console.error(err);
        res.status(500).json({
            message : "Failed to delete product",
        });

    }
}