import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { mongoDB,PORT } from './config.mjs';
import router from './src/route.mjs';
const app= express();
app.use(express.json());
app.use(multer().any());
mongoose.connect(mongoDB).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
});
app.use('/',router);
app.listen(PORT||8080,()=>{
    console.log(`Server is running on port ${PORT}`);
})