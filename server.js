import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDb from './config/mongodb.js';
import route from './routes/users.route.js';
import cookieParser from 'cookie-parser';
const app=express();

//middlewares
app.use(express.json()); //This line allows your server to read JSON data sent from frontend or Postman.
app.use(express.urlencoded({extended:true})); //parses form data sent via HTML forms.
const corseOption={
    origin:'http://localhost:5173',
    credentials:true,
    
}
app.use(cors(corseOption));
dotenv.config();
const PORT=3000;

app.use(cookieParser());

//route
app.use("/api/v1/user",route)

connectDb();
app.get('/',(req,res)=>{
 res.send('Hello World');
})

app.listen(PORT,()=>{
 console.log(`Server is running on http://localhost:${PORT}`);
})