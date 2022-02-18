const express = require('express')

const User = require('../models/User')

const auth = require('../middleware/auth')

const router = new express.Router()


// Sends post request to create new user
router.post('/api/users', async (req, res) => {

  const newUser = User(req.body)

  try {

    await newUser.save()

    const token = await newUser.generateAuthToken()

    res.status(201).send({ user: newUser, token })

  } catch (error) {

    res.status(400).send({ error: 'Server Error' })

  }

})


// Sends post request to log user in
router.post('/api/users/login', async (req, res) => {

  const userData = User(req.body)

  try {

    const user = await User.findbyCredentials(userData.name, userData.password)

    const token = await user.generateAuthToken()

    res.status(200).send({ user, token })

  } catch (error) {

    res.status(400).send({ error: 'Server Error' })

  }

})


// Sends post request to log user out
router.post('/api/users/logout', auth, async (req, res) => {

  try {

    req.user.tokens = req.user.tokens.filter(item => item.token != req.token)

    await req.user.save()

    res.status(200).send()

  } catch (error) {

    res.status(500).send({ error: 'Server Error' })

  }

})


// sends get request to fetch auth user
router.get('/api/users/user', auth, async (req, res) => {

  res.send(req.user)

})


// sends get request to get user
router.post('/api/users/user', async (req, res) => {

  try {

    const user = await User.findOne({ name: req.body.name })

    if (user === null) { return res.status(404).send({ message: 'user does not exist' }) }

    res.send({ message: 'user exists' })

  } catch (error) {

    res.status(404).send({ message: 'user exists' })

  }

})


module.exports = router
