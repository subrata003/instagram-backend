import jwt from "jsonwebtoken";

const userAuth=async(req,res,next)=>{
 const{token}=req.cookies;
 if(!token){
  res.status(401).json({message:"Please login first"});
 }
 try {
  const decodeToken= jwt.verify(token,process.env.SEC_KEY);
  req.userId=decodeToken.id;
  next();
  
 } catch (error) {
  
 }
}