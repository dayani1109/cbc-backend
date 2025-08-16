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
        const products = await Product.find()
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
        const productID = req.params.productID // body venuvt params danva


        // if(productID ==  null){//product id ekak thibbe nathi unoth
        //     res.status(400).json({
        //         message : "Product Id is required"
        //     });
        //     return;
        // }

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

export async function updateProduct(req, res){
    if (!isAdmin(req)){
        res.status(403).json({
            message:"you are not authorized to create a product"
        });
        return;
    }

    try{
        const productID = req.params.productID;
        const updateData = req.body;
        await Product.updateOne(
            {productID : productID},
            updateData
        );

        res.json({
            message : "product updated successfully"
        });

    }catch(err){
        console.error(err);
        res.status(500).json({
            message : "Failed to update product",
        });
    }
}

// 1 product ekak visthra vitharak ganna 

export async function getProductId(req, res){

    try{
        const productID = req.params.productID;

        const product = await Product.findOne(
            {
                productID : productID
            }
        )

        if(product == null){
            res.status(404).json({
                message : "Product not found"
            });
        }else{
            res.json(product)
        }

    }catch(err){
        console.error(err);
        res.status(500).json({
            message : "Failed to retrieve product by Id",
        });
    }
}