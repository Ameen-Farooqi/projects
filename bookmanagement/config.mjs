import dotenv from 'dotenv';
dotenv.config();
const mongoDB= process.env.mongoDB;
const PORT= process.env.PORT;
const secretKey= process.env.secretKey;
const accessKey= process.env.accessKey;
const secretAccessKey= process.env.secretAccessKey;
const region= process.env.region;
export {mongoDB,PORT,secretKey,accessKey,secretAccessKey,region};