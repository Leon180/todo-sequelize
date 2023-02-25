const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

router.get('/', async (req, res) => {
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

module.exports = router