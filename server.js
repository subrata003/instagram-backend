import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDb from './config/mongodb.js';
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



connectDb();
app.get('/',(req,res)=>{
 res.send('Hello World');
})

app.listen(PORT,()=>{
 console.log(`Server is running on http://localhost:${PORT}`);
})