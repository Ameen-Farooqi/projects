import dotenv from 'dotenv'
dotenv.config();
const URI= process.env.mongoDB;
const PORT= process.env.PORT;
const secretKey= process.env.secretKey;
export{URI,PORT,secretKey};