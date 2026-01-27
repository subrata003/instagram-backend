import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
 try {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
   return res.status(400).json({ message: "All fields are required" });
  }
  const isUser = await User.findOne({ email });
  if (isUser) {
   res.status(400).json({ success: false, message: "User already exists" });
  }
  const hashpw = await bcrypt.hash(password, 10);


  const user = new User({ name, email, password: hashpw });
  await user.save();
  return res.status(200).json({ success: true, message: "User registered successfully" });

 } catch (error) {
  res.status(500).json({ message: error.message });

 }

}

export const login=async(req,res)=>{
 const{email,password}=req.body;
 if(!email||!password){
  return res.status(400).json({success :false,message:"All fields are required"})
 }
 try {
  let user=await User.findOne({email});
  if(!user){
   return res.status(400).json({success:false,message:"User not found"})
  }
  const isMatch=await bcrypt.compare(password,user.password);
  if(!isMatch){
   return res.status(400).json({success:false,message:"Invalid details"})
  }

  user={
   _id:user._id,
   username:user.user,
   email:user.email,
   profilePic:user.profilePic,
   bio:user.bio,
   followers:user.followers,
   following:user.following,
   post:user.posts,
   bookmarks:user.bookmarks

  }
  const token=jwt.sign({id:user._id},process.env.SEC_KEY,{expiresIn:"1d"});

   res.cookie("token",token,{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? 'none' : "strict",
      maxAge: 1000 * 60 * 60
    }).status(200).json({success:true,message:"Login successful",token});
   return res.status(200).json({success:true,message:"Login successful",token,user});
  } catch (error) {
  res.status(500).json({ message: error.message });
  
 }

}

export const logout=async (req,res)=>{
 try {
  res.cookie("token","",{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? 'none' : "strict",
    maxAge: 0
  }).status(200).json({success:true,message:"Logout successful"
  })

  
 } catch (error) {
  res.status(500).json({ message: error.message });
  
 }
 
}

export const getUser=async (req,res)=>{
 try {
  const userid=req.params.id;
  let user=await User.findById(userid)
  if(!user) return res.status(404).json({success:false,message:"User not found"})

  res.status(200).json({success:true,message:"User found",user})
  
 } catch (error) {
  res.status(500).json({ message: error.message });
  
 }
}

export const editProfile=async(req,res)=>{
 try {
  const userId=req.userId;
  if(!userId) return res.status(404).json({success:false,message:"User not found"})
  
 } catch (error) {
  res.status(500).json({ message: error.message });
  
 }
}