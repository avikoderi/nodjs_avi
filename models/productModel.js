const mongoose = require("mongoose");
const Joi = require("joi");
const { string } = require("joi");

let productSchema = new mongoose.Schema({
    name:String,
    price:Number,
    cal:Number,
  
    info:String,
    category:String,
    img:String,
    user_id:String,
    date_created:{
      type:Date , default:Date.now()
    }
  })

  exports.ProductModel = mongoose.model
  ("products", productSchema);

  exports.validateProduct = (_reqBody) => {
    let joiSchema = Joi.object({
      name:Joi.string().min(2).max(99).required(),
      price:Joi.number().min(20).max(999999).required(),
      mkt:Joi.number().min(20).max(999999).required(),
      info:Joi.string().min(2).max(500),
      category:Joi.string().min(2).max(99).required(),
      
      img:Joi.string().min(0).max(230).allow(null, '')
    })
    return joiSchema.validate(_reqBody);
  }
  
          
      
   
