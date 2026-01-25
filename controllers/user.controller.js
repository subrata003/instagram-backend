import User from "../models/user.model.js";
import bcrypt from "bcrypt";

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