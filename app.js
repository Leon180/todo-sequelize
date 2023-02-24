const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bcrybt = require('bcryptjs')

const db = require('./models')
const Todo = db.Todo
const User = db.User

const app = express()
const PORT = 3000
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  try {
    const todos = await Todo.findAll({
      raw: true,
      nest: true
    })
    return res.render('index', { todos: todos })
  }
  catch (error) {
    return res.status(422).json(error)
  }
})

app.get('/users/login', (req, res) => {
  res.render('login')
})

app.post('/users/login', (req, res) => {
  res.send('login')
})

app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  await User.create({ name, email, password })
  res.redirect('/')
})

app.get('/users/logout', (req, res) => {
  res.send('logout')
})

app.get('/todos/:id', async (req, res) => {
  const id = req.params.id
  try {
    const todo = await Todo.findByPk(id)
    return res.render('detail', { todo: todo.toJSON() })
  }
  catch (error) {
    console.log(error)
  }
})


app.listen(PORT, () => {
  console.log(`App is runing on http://localhost:${PORT}`)
})