const express = require('express')
const router = express.Router()
const db = require('../../models')
const User = db.User
// 引用 passport
const passport = require('passport')
const bcrypt = require('bcryptjs')

router.get('/login', (req, res) => {
  res.render('login')
})

// 加入 middleware，驗證 request 登入狀態
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  const errors = []
  const { name, email, password, confirmPassword } = req.body
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: 'Please input all columns.' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: 'Password and confirm password are not match.' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  try {
    const user = await User.findOne({ where: { email } })
    if (user) {
      console.log('User already exists')
      return res.render('register', {
        name,
        email,
        password,
        confirmPassword
      })
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user_register = await User.create({
      name,
      email,
      password: hash
    })
    // if successful register, than directly login
    req.login(user_register, (error) => {
      if (!error) {
        res.redirect('/');
      } else {
        console.log(error)
      }
    })
  }
  catch (error) {
    console.log(error)
  }
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('login')
})

module.exports = router