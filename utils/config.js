require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URL = process.env.MONGO_URL

module.exports = {
  PORT,
  MONGODB_URL
}