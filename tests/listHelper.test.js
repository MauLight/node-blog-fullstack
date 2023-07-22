const listHelper = require('../utils/list_helper')
const { blogs, blogList } = require('../utils/blogs')

describe('total likes', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(blogList)

    expect(result).toBe(5)
  })

  test('when list has many blogs, equals number of likes', () => {
    const result = listHelper.totalLikes(blogs)

    expect(result).toBe(36)
  })
})

describe('the favorite ones', () => {
  test('favorite blog', () => {
    const result = listHelper.favoriteBlog(blogs)

    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })

  test('author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)

    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })

  test('author with most likes', () => {
    const result = listHelper.mostLikes(blogs)

    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})