function admin(req,res,next){
    if(req.user.role!="admin") 
    return res.status(403).send("You are not authorized to view this");
    next();
}

module.exports= admin;