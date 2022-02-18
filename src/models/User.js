const mongoose = require('mongoose')

const bcryptjs = require('bcryptjs')

const jsonwebtoken = require('jsonwebtoken');

const Location = require('./Location');


// Sets up user schema
const userSchemer = new mongoose.Schema({

  name: {

    type: String,

    required: true,

    trim: true,

    unique: true

  },

  password: {

    type: String,

    trim: true,

    required: true,

    minlength: 5,

    validate(value) {

      if (value.toLowerCase().includes('password')) {

        throw new Error('Password must not include "password"')

      }

    },

  },

  tokens: [

    {

      token: {

        type: String,

        required: true

      }

    }

  ],

}, { timestamps: true });


// Create Virtual relationship with Location
userSchemer.virtual('locations', {

  ref: 'Location',

  localField: '_id',

  foreignField: 'owner'

})


// Generate Authentication Token
userSchemer.methods.generateAuthToken = async function () {

  const user = this

  const token = jsonwebtoken.sign({ _id: user.id.toString() }, process.env.JWT_SECRET, {})

  user.tokens = user.tokens.concat({ token })

  await user.save()

  return token

}


// Private profile
userSchemer.methods.toJSON = function () {

  const user = this

  const returnUser = user.toObject()

  delete returnUser.password

  delete returnUser.tokens

  return returnUser

}


// Public profile
userSchemer.methods.toPublicJSON = function () {

  const user = this

  const returnUser = user.toObject()

  delete returnUser.password

  delete returnUser.tokens

  return returnUser

}


// For login
userSchemer.statics.findbyCredentials = async (name, password) => {

  const user = await User.findOne({ name: name })

  if (!user) throw new Error('Unable to login')

  const isMatch = await bcryptjs.compare(password, user.password)

  if (!isMatch) throw new Error('Unable to login')

  return user

}


// Hash password
userSchemer.pre('save', async function (next) {

  const user = this

  if (user.isModified('password')) user.password = await bcryptjs.hash(user.password, 8)

  next()

})


// Delete (cascade) tasks
userSchemer.pre('remove', async function (next) {

  const user = this

  await Location.deleteMany({ owner: user._id })

  next()

})


// Create User Model
const User = mongoose.model('User', userSchemer)


module.exports = User