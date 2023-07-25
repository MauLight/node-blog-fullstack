const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {

  await User.deleteMany({})
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  const newUser = {
    'username': 'Test_User',
    'name': 'Mau',
    'password': 'Elvandmau916.',
    'blogs': [],
  }

  const user = await api
    .post('/api/users')
    .send(newUser)

  console.log(user.body)

}, 30000)

describe('when there is initially some blogs saved', () => {

  test('blogs are returned as json', async () => {

    const token = await helper.logUser()

    await api
      .get('/api/blogs')
      .set({ Authorization: 'Bearer ' + token })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 10000)

  test('all blogs are returned', async () => {

    const token = await helper.logUser()
    const res = await api.get('/api/blogs')
      .set({ Authorization: 'Bearer ' + token })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {

    const token = await helper.logUser()
    const res = await api.get('/api/blogs')
      .set({ Authorization: 'Bearer ' + token })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const titles = res.body.map(result => result.title)
    expect(titles).toContain(
      'Some blog post'
    )
  })
})

describe('viewing a specific blog', () => {

  test('identifier property of the blog posts is named id', async () => {
    const token = await helper.logUser()
    const res = await api.get('/api/blogs')
      .set({ Authorization: 'Bearer ' + token })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const ids = res.body.map(result => result.id)
    expect(ids).toBeDefined()
  })

  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]
    const token = await helper.logUser()

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .set({ Authorization: 'Bearer ' + token })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    console.log(resultBlog.body)
    expect(resultBlog.body.title).toEqual(blogToView.title)
  })

  test('fails with statuscode 404 if note does not exist', async () => {
    const token = await helper.logUser()
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .set({ Authorization: 'Bearer ' + token })
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const token = await helper.logUser()
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/blogs/${invalidId}`)
      .set({ Authorization: 'Bearer ' + token })
      .expect(400)
  })
})

describe('addition of a new blog', () => {

  test('a valid blog can be added', async () => {

    const token = await helper.logUser()

    const newBlog = {
      title:'The hard truth about rocks',
      author: 'Mau Light',
      url: 'www.poto.com',
      likes: 1000
    }
    await api
      .post('/api/blogs')
      .set({ Authorization: 'Bearer ' + token })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('The hard truth about rocks')
  })

  test('if likes is missing, value defaults to zero', async () => {

    const token = await helper.logUser()

    const newBlog = {
      title: 'The hard truth about rocks',
      author: 'Bon Coltrain',
      url: 'www.somesite.com'
    }

    await api
      .post('/api/blogs')
      .set({ Authorization: 'Bearer ' + token })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toEqual(0)
  })

  test('blog without title or url is not added', async () => {

    const token = await helper.logUser()

    const newBlog = [
      {
        author: 'Bon Coltrain',
        likes: 12,
        url: 'www.somesite.com'
      },
      {
        title: 'The benefits of moving your fingers',
        author: 'Icarus Burned',
        likes: 32,
      }
    ]

    for (let blog of newBlog) {
      await api
        .post('/api/blogs')
        .set({ Authorization: 'Bearer ' + token })
        .send(blog)
        .expect(400)
    }

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('update a blog', () => {
  test('an updated blog request succeeds', async () => {

    const token = await helper.logUser()

    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[1]

    const newBlog = {
      title: 'Some other updated blog post',
      author: 'Mau Lux',
      url: 'someotherupdatedurl.com',
      likes: 900
    }

    const resultBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set({ Authorization: 'Bearer ' + token })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body).toEqual(newBlog)
  })
})

describe('deletion of a blog', () => {

  test('a blog can be deleted', async () => {

    const token = await helper.logUser()

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    console.log(blogToDelete.id)
    console.log(token)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: 'Bearer ' + token })
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })

})

afterAll(async () => {
  await mongoose.connection.close()
})