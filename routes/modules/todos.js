const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  console.log(req.user)
  return res.render('new')
  // const userId = req.user._id
  // const name = req.body.name
  // return Todo.create({ name, userId })
  //   .then(() => res.redirect('/'))
  //   .catch(error => console.log(error))
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

router.get('/:id/edit', (req, res) => {
  return res.render('new')
  // const userId = req.user._id
  // const _id = req.params.id
  // return Todo.findOne({ _id, userId })
  //   .lean()
  //   .then(todo => res.render('edit', { todo }))
  //   .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  return res.render('new')
  // const userId = req.user._id
  // const _id = req.params.id
  // const { name, isDone } = req.body
  // return Todo.findOne({ _id, userId })
  //   .then(todo => {
  //     todo.name = name
  //     todo.isDone = isDone === 'on'
  //     return todo.save()
  //   })
  //   .then(() => res.redirect(`/todos/${_id}`))
  //   .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  return res.render('new')
  // const userId = req.user._id
  // const _id = req.params.id
  // return Todo.findOne({ _id, userId })
  //   .then(todo => todo.remove())
  //   .then(() => res.redirect('/'))
  //   .catch(error => console.log(error))
})

module.exports = router