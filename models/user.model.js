import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
 user: { type: String, required: true, unique: true },
 email: { type: String, required: true, unique: true },
 password: { type: String, required: true },
 profilePic: { type: String, default: '' },
 bio: { type: String, default: '' },
 followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
 following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
 posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
 bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
 createdAt:{type:Date,default:Date.now},


})
const User=mongoose.model("User",userSchema);
export default User;