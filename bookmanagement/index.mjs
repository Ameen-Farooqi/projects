import express from 'express';
import mongoose from 'mongoose';
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