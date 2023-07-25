let jwt = require("jsonwebtoken");

const fetchuser =  async(req,res,next)=>{
    const token = req.header('authtoken');
    if (!token) {
        return res.status(400).json({error:"Token not provided"});
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded; // check from database
        next();
    }catch(err){
        // console.log(err);
        return res.status(400).json({error:"Invalid Token!"});
    }
}

module.exports = fetchuser;
