const _ = require('lodash')

const totalLikes = (blogs) => {
  let aux = 0
  blogs.forEach(elem => {
    aux += elem.likes
  })
  return aux
}

const favoriteBlog = (blogs) => {
  let favorite = {}
  let aux = 0
  blogs.forEach(elem => {
    if (elem.likes > aux) {
      aux = elem.likes
      favorite = elem
    }
  })
  return {
    'author': favorite.author,
    'likes': favorite.likes,
    'title': favorite.title
  }
}

const mostBlogs = (blogs) => {
  const mapBlogs =  _.countBy(blogs, 'author')
  return {
    author: _.max(Object.keys(mapBlogs), o => mapBlogs[o]),
    blogs: _.max(Object.values(mapBlogs), o => mapBlogs[o])
  }
}

const mostLikes = (blogs) => {
  let likesArr = []
  let aux = 0
  let i = 0
  const authors = _.uniq(_.map(blogs, 'author'))

  authors.forEach(auth => {
    blogs.forEach(blog => {
      if(blog.author === auth) {
        aux += blog.likes
      }
    })
    likesArr[i] = { author: auth, likes: aux }
    aux = 0
    i++
  })

  const mostLikes = _.sortBy(likesArr, 'likes')
  return mostLikes[mostLikes.length - 1]
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}