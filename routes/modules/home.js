const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

router.get('/', async (req, res) => {
  const UserId = req.user.id
  try {
    const todos = await Todo.findAll({
      where: {
        UserId
      },
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