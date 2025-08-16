import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export function createUser(req,res){

    const hashedPassword = bcrypt.hashSync(req.body.password,10)

    const user = new User(
        {
            email : req.body.email,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            password : hashedPassword
        }
    )

    user.save().then(
        ()=>{
            res.json({
                message: "User created successfully"
            })
        }
    ).catch(
        ()=>{
            res.json({
                message: "Fail to create user"
            })
        }
    )
}

export function loginUser(req,res){

    User.findOne(//me email ekt gelapena 1kenek innvd kiyala check karanava findone ekem
        {
            email : req.body.email
        }
    ).then(
        (user) =>{//e email ekt user kenek hamba unad kiyala balann ona
            if(user == null){
                res.status(404).json(
                    {
                        message : "User not found"
                    }
                )

            }else{
                const isPasswordMatching = bcrypt.compareSync(req.body.password, user.password) 

                if(isPasswordMatching){

                    const token = jwt.sign(
                        {
                            email : user.email,
                            firstName : user.firstName,
                            lastName : user.lastName,
                            role : user.role,
                            isEmailVerified : user.isEmailVerified,
                        },
                        "jwt-secret"
                    )

                    res.json(
                        {
                            message : "Login successful",
                            token : token
                        }
                    )
                }else{
                    res.status(500).json(
                        {
                            message : "Invalid password"
                        }
                    )
                }

            }
        }
    )
}

export function isAdmin(req){

    //only admin user can ->
    if(req.user == null){
        // res.status(401).json({
        //     message:"please login and try again"
        // });
        return false; //pahala code tika run vena eka methanin ehat navathinva
    }

    if(req.user.role != "admin"){
        // res.status(403).json({
        //     message:"you are not authorized to create a product"
        // });
        return false;
    }

    return true;

}

export function isCustomer(req){
    if(req.user == null){
        return false;
    }
    if(req.user.role != "user"){
        return false;
    }

    return true;
}