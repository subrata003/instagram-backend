import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDataUri } from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
 try {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
   return res.status(400).json({ message: "All fields are required" });
  }
  const isUser = await User.findOne({ email });
  if (isUser) {
   return res.status(400).json({ success: false, message: "User already exists" });
  }
  const hashpw = await bcrypt.hash(password, 10);


  const user = new User({ username, email, password: hashpw });
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
    }).status(200).json({success:true,message:"Login successful",token,user});
   return res.status(200).json({success:true,message:"Login successful",user});
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
  const {bio}=req.body;
  const profilePic=req.file;
  let cloudeResponse;

  if(profilePic){
    const fileUri=getDataUri(profilePic)
    cloudeResponse=await cloudinary.uploader.upload(fileUri)
  }

  const user=await User.findById(userId).select('-password');
  if(!user) return res.status(404).json({success:false,message:"User not found"})
    if(bio) user.bio=bio;
    if(profilePic) user.profilePic=cloudeResponse.secure_url;

    await user.save();

    return res.status(200).json({success:true,message:"Profile updated successfully",user})

  
 } catch (error) {
  res.status(500).json({ message: error.message });
  
 }
}
export const getSuggestUser = async (req, res) => {
  try {
     const userId=req.userId;
    console.log("login usr id is ",userId);
    

    const user = await User.findById(userId);
    console.log("backend user is ",user);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const suggestUser = await User.find({
      _id: { $ne: userId }
    })
      .select("-password")
      .limit(5);

    if (suggestUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No suggested users found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Suggested users",
      suggestUser
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const followOrUnfollow=async(req,res)=>{
  try {
    const userId=req.userId;
    const followkornewala=userId
    const jiskofollowkorunga=req.params.id;
    if(followkornewala === jiskofollowkorunga){
      return res.status(404).json({success:false,message:"You can not follow yourself"})
    }
    const user=await User.findById(userId);
    const targetUser=await User.findById(jiskofollowkorunga);
    if(!user || !targetUser) return res.status(404).json({success:false,message:"User not found"})
   const isFollowed=user.following.includes(jiskofollowkorunga);
   if(isFollowed){

    await Promise.all([
      User.updateOne({_id:followkornewala},{$pull:{following:jiskofollowkorunga}}),
      User.updateOne({_id:jiskofollowkorunga},{$pull:{followers:followkornewala}}),
    ])
    return res.status(200).json({success:true,message:"Unfollowed"})
     
   }
   else{
    //when we can perform two opreationat at a time , than we use promise.all
    await Promise.all([
      User.updateOne({_id:followkornewala},{$push:{following:jiskofollowkorunga}}),
      User.updateOne({_id:jiskofollowkorunga},{$push:{followers:followkornewala}}),
    ])
    return res.status(200).json({success:true,message:"Followed"})
   }



    
  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
}