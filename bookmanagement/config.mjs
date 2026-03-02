import dotenv from 'dotenv'
dotenv.config()
const config = {
  mongoURI: process.env.MongoDB,
  port: process.env.PORT || 8080,
  secretToken: process.env.secretToken
}
export default config;