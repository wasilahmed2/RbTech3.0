var mongoose=require("mongoose");
const Joi= require("@hapi/joi");
var productSchema= mongoose.Schema({
    name: String,
    price: String,
})

var Product= mongoose.model("Product", productSchema);

function validateProduct(data){
    const schema = Joi.object({
        name: Joi.string().min(3).max(25).required(),
        price: Joi.string().min(0).max(10).required(),
        
    });
    return schema.validate(data , {abortEarly: false});
}
 

module.exports.Product = Product; 
module.exports.validate = validateProduct; 