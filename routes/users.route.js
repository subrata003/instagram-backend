import express from "express";
import { editProfile, followOrUnfollow, getSuggestUser, getUser, login, logout, register } from "../controllers/user.controller.js";
import userAuth from "../middleware/userauth.js";
import upload from "../middleware/multer.js";

const route=express.Router();

route.post("/register",register);
route.post("/login",login);
route.get("/logout",logout)
route.get("/:id/profile",userAuth,getUser)
route.post("/editprofile",userAuth,upload.single("image"),editProfile)
route.get("/suggested",userAuth,getSuggestUser)
route.post("/followunfollow/:id",userAuth,followOrUnfollow)

export default route
