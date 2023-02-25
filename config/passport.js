const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      let user = await User.findOne({ where: { email } })
      user = user.toJSON()
      if (!user) {
        return done(null, false, { message: 'That email is not registered!' })
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return done(null, false, { message: 'Email or Password incorrect.' })
      }
      return done(null, user)
    }
    catch (error) {
      done(error, false)
    }
  }))
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']// Request Facebook's public data
  }, async (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    try {
      let user = await User.findOne({ where: { email } })
      if (user) {
        user = user.toJSON()
        return done(null, user)
      }
      const randomPassword = Math.random().toString(36).slice(-8)
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(randomPassword, salt)
      const facebook_user = await User.create({
        name, email, password: hash
      })
      return done(null, facebook_user)
    }
    catch (error) {
      return done(error, false)
    }
  }))
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      let user = await User.findByPk(id)
      user = user.toJSON()
      done(null, user)
    }
    catch (error) {
      done(error, null)
    }
  })
}