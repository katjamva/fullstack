const { test, after, beforeEach } =  require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)

})

test('id property of blogs is named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
        assert.ok(blog.id)
        assert.strictEqual(blog._id, undefined)
    })
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    
    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes("Type wars"))

})

test('missing likes property defaults to value 0', async () => {
    const newBlog = {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const saved = blogsAtEnd.find(blog => blog.title === "TDD harms architecture")
    assert.strictEqual(saved.likes, 0)
})

test('fails with status code 400 if no title', async () => {
    const newBlog = {
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('fails with status code 400 if no url', async () => {
    const newBlog = {
        title: "First class tests",
        author: "Robert C. Martin",
        likes: 10
    }

    await api  
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('deletes a single blog with status 204', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    blogsAtEnd = await helper.blogsInDb()

    const blogs = blogsAtEnd.map((blog) => blog.title)
    assert(!blogs.includes(blogToDelete.title))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length-1)
})

test('update blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updated = {...blogToUpdate, likes: blogToUpdate.likes + 1}

    await api   
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updated)
        .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    const blogAfterUpdate = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

    assert.strictEqual(blogAfterUpdate.likes, blogToUpdate.likes+1)

})

after(async () => {
    await mongoose.connection.close()
})