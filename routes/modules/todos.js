const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

// create
router.get('/new', (req, res) => {
  return res.render('new')
})
router.post('/', async (req, res) => {
  const UserId = req.user.id
  const name = req.body.name
  try {
    await Todo.create({ name, UserId })
    res.redirect('/')
  }
  catch (error) {
    console.log(error)
  }
})

// detail
router.get('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const todo = await Todo.findByPk(id)
    return res.render('detail', { todo: todo.toJSON() })
  }
  catch (error) {
    console.log(error)
  }
})

// edit
router.get('/:id/edit', async (req, res) => {
  const id = req.params.id
  try {
    const todo = await Todo.findByPk(id)
    return res.render('edit', { todo: todo.toJSON() })
  }
  catch (error) {
    console.log(error)
  }
})
router.put('/:id', async (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body
  try {
    await Todo.update({
      name, isDone: isDone === 'on'
    }, {
      where: {
        id
      }
    });
    return res.redirect(`/todos/${id}`)
  }
  catch (error) {
    console.log(error)
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    await Todo.destroy({
      where: {
        id
      }
    });
    res.redirect('/')
  }
  catch (error) {
    console.log(error)
  }
})

module.exports = router