import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/connectDB.js';
import transactionRoutes from './routes/transactionRoutes.js'

const app = express()

dotenv.config();
const PORT = process.env.PORT;

//Cors policy
app.use(cors()); 

//Connect Database
connectDB();

//JSON
app.use(express.json())

//Load Routes
app.use(transactionRoutes);



app.listen(PORT, ()=>{
    console.log(`Server Running on port ${PORT}`);
})

