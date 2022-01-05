const mongoose = require("mongoose");
const Joi = require("joi");
const Jwt = require("jsonwebtoken");
const { config } = require("../config/secret");
// const {allow} = require("Joi");
// const { date } = require("Joi");
 

let userSchema =new mongoose.Schema({
    name :String,
   email :String,
    password :String,
   adress :String,
   role: {
    type: String, default: "regular"
},

   Date_created:{
       type:Date, default:Date.now()
   }
})

exports.UserModel = mongoose.model("users",userSchema);

exports.genToken=(_id)=> {
    let token = Jwt.sign({_id:_id},config.TokenSecret,
        {expiresIn:"60mins"})
return token;
}

exports.validateUser =(_reqBody) => {
    let JoiSchema =Joi.object({
        name : Joi.string().min(2).max(99).required(),
   
        email : Joi.string().min(3).max(99).email().required(),
        password : Joi.string().min(2).max(99).required(),
       
        // phone: Joi.String().min(2).max(99).allow(null,""),
       adress: Joi.string().min(2).max(99).allow(null,""),

    })
    return JoiSchema.validate(_reqBody)
}

exports.validateLogin =(_reqBody)=>{
    let JoiSchema =Joi.object({
        email : Joi.string().min(3).max(99).email().required(),
        password : Joi.string().min(2).max(99).required(),
    })
    return JoiSchema.validate(_reqBody);

}