import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
       email :{
        type : String,
        require : true,
        unique : true
       },

       firstName : {
        type : String,
        require : true
       },

       lastName : {
        type : String,
        require : true
       },

       password : {
        type : String,
        require : true
       },

       role : {
        type : String,
        require : true,
        default : "user"
       },

       isBlock : {
        type : Boolean,
        default : false 
       },

       isEmailVerified : {
        type : Boolean,
        default : false 
       },

       image : {
        type : String,
        default : "/user.png"
       }
    }
)

const User =  mongoose.model("User", userSchema)

export default User