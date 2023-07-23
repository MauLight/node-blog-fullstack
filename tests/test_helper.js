const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Some blog post',
    author: 'Mau Light',
    url: 'someurl.com',
    likes: 99
  },
  {
    title: 'Some other blog post',
    author: 'Mau Lux',
    url: 'someotherurl.com',
    likes: 95
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'Deleted person',
    url: 'www.deleteme.com',
    likes: 0
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  console.log(blogs.map(blog => blog.toJSON()))
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}