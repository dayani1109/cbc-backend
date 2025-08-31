import express from "express" ;
import mongoose from "mongoose";
import studentRouter from "./routes/studentRouter.js";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken";
import productRouter from "./routes/productRouter.js";
//import cors
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express()

app.use(cors())

app.use(express.json())
//middleware authentication part
app.use(
    (req,res,next)=>{
        let token = req.header("Authorization") //token ek thiyenn ona request eke header eke Authorization eke kiyala dila tiyenne
        if(token != null){ // token ekk thiyenvnm token ek print karanva
            token = token.replace("Bearer ","")//Bearer  replace kara gannva mek nathuv token ek print karanna
            console.log(token)

            // token ek decrypt karanva
            jwt.verify(token,process.env.JWT_SECRET,
                //decrypt vunath nathath me function ek run venva
                (err, decoded)=>{
                    if(decoded == null){
                        res.json(
                            {
                                message : "Invalid token please login again"
                            }
                        )
                        return // methanin ehata me function ek run venn epa 
                    }else {
                        req.user = decoded // request eka athulat userge details tikath dagannva, hebeyi thama mek katavth yevuve naa
                    }
                    
            })
        }
        next()//request ek adala kenat yavanva token ek weradi nathnm
    }   
)

const connectionString = process.env.MONGO_URI

mongoose.connect(connectionString).then(
    ()=>{
        console.log("Database connected")
    }
).catch(
     ()=>{
        console.log("Database connected failed")
    }
)

app.use("/api/students", studentRouter)
app.use("/api/users", userRouter)
app.use("/api/products", productRouter)


app.listen(5000, (req,res)=>{ 
    console.log("server is started")
})
