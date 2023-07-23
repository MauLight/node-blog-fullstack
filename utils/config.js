require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URL = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGO_URI : process.env.MONGO_URL

module.exports = {
  PORT,
  MONGODB_URL
}