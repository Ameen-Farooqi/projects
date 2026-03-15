import express from 'express';
import mongoose from 'mongoose';
<<<<<<< HEAD
import router from './src/route.mjs'
import config from './config.mjs';
//Change all the APi's based on your code
const app = express();
app.use(express.json());

mongoose
  .connect(config.mongoURI)
  .then(() => console.log('database connected successfully'))
  .catch((err) => console.log(err));

app.use('/', router);

app.listen(config.port, () => {
  console.log(`Server Started at ${config.port}`)
});
=======
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
>>>>>>> c4e10ef7b9c7a28a59d3b0716b7dc53d28d98020
