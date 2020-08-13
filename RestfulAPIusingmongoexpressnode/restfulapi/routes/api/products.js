const express = require("express");
let router= express.Router();
const validateProduct =require("../../middlewares/validateProduct")
const auth =require("../../middlewares/auth")
const admin= require("../../middlewares/admin")

var { Product }=require("../../models/product");
const { response } = require("../../app");

//get all products

router.get("/", async (req,res)=>{
    console.log(req.user);
    let page= Number(req.query.page? req.query.page:1);
    let perPage= Number(req.query.perPage? req.query.perPage: 10);
    let skipRecords=perPage*(page-1)
    let products= await Product.find().skip(skipRecords).limit(perPage);
    return res.send(products);
});

//get single product
router.get("/:id", async (req,res)=>{
try{
    let product= await Product.findById(req.params.id);
    if(!product) return res.status(400).send("Product with given ID is not found") //when id not present in database
    return res.send(product);
}
catch(err){
    return res.status(400).send("Invalid ID"); //when id format not correct 
}
});

//update record
router.put("/:id", validateProduct ,async(req,res)=>{
    let product= await Product.findById(req.params.id);
    product.name=req.body.name;
    product.price=req.body.price;
    await product.save();
    return res.send(product);
})
//delete record from db
router.delete("/:id",auth, admin, async(req,res)=>{
    let product= await Product.findByIdAndDelete(req.params.id);
    return res.send(product);
})

//insert new record into db
router.post("/", auth, validateProduct,async(req,res)=>{
    
    let product = new Product();
    product.name=req.body.name;
    product.price=req.body.price;
    await product.save();
    return res.send(product);
})
module.exports= router;