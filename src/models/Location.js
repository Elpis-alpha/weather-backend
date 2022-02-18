const mongoose = require('mongoose')


const locationSchema = new mongoose.Schema({

  owner: {

    type: mongoose.Schema.Types.ObjectId,

    required: true,

    ref: 'User'

  },

  name: {

    type: String,

    required: true,

    trim: true,

  },

  longitude: {

    type: Number,

    required: true,

  },

  latitude: {

    type: Number,

    required: true,

  },

}, { timestamps: true })

// Location Model
const Location = mongoose.model('Location', locationSchema)

module.exports = Location
