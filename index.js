import express from "express" ;
import mongoose from "mongoose";
import studentRouter from "./routes/studentRouter.js";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken";
import productRouter from "./routes/productRouter.js";

const app = express()
app.use(express.json())
//middleware authentication part
app.use(
    (req,res,next)=>{
        let token = req.header("Authorization") //token ek thiyenn ona request eke header eke Authorization eke kiyala dila tiyenne
        if(token != null){ // token ekk thiyenvnm token ek print karanva
            token = token.replace("Bearer ","")//Bearer  replace kara gannva mek nathuv token ek print karanna
            console.log(token)

            // token ek decrypt karanva
            jwt.verify(token,"jwt-secret",
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

const connectionString = "mongodb+srv://admin:1234@cluster0.q6je6ze.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(connectionString).then(
    ()=>{
        console.log("Database connected")
    }
).catch(
     ()=>{
        console.log("Database connected failed")
    }
)

app.use("/students", studentRouter)
app.use("/users", userRouter)
app.use("/products", productRouter)


app.listen(5000, (req,res)=>{ 
    console.log("server is running on port 5000")
})
