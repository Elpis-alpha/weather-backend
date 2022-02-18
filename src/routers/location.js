const express = require('express')

const Location = require('../models/Location')

const auth = require('../middleware/auth')

const router = new express.Router()


// Sends post request to create items
router.post('/api/location', auth, async (req, res) => {

  const newLocation = new Location({

    ...req.body,

    owner: req.user._id

  })

  try {

    await newLocation.save()

    res.status(201).send(newLocation)

  } catch (error) {

    res.status(400).send({error: "Server Error"})

  }

})


// Sends get request to get all items
router.get('/api/location', auth, async (req, res) => {

  try {

    await req.user.populate({

      path: 'locations', options: {}

    })

    res.send(req.user.locations)

  } catch (error) {

    res.status(500).send({ error: 'Server Error' })

  }

})


// Sends delete request to delete items
router.delete('/api/location/:id', auth, async (req, res) => {

  const _id = req.params.id

  try {

    const location = await Location.findOneAndDelete({ _id, owner: req.user._id })

    if (!location) return res.status(404).send()

    res.send(location)

  } catch (error) {

    res.status(500).send({error: "Server Error"})

  }

})


module.exports = router
