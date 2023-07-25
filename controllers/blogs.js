const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const notes = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

blogsRouter.get('/:id', async (request, response) => {

  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {

  const body = request.body

  // const user = await User.findById(request.token.id)
  const user = request.user
  console.log(user)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id.toString()
  })

  const savedBlog = await blog.save()
  console.log(savedBlog._id.toString())
  user.blogs = user.blogs.concat(savedBlog._id.toString())
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' }
  )
  response.status(201).json({ title, author, url, likes })
})

blogsRouter.delete('/:id', async (request, response) => {
  const userId = request.token.id
  const blogId = request.params.id

  //  const blog = await Blog.findById(blogId)
  const user = await User.findById(userId.toString())

  // if(blog.user.toString() === userId) {

  user.blogs = user.blogs.filter((elem) => {

    elem.id.toString() !== blogId
  })
  await Blog.findByIdAndRemove(blogId)
  await user.save()
  // }

  response.status(204).end()
})

module.exports = blogsRouter