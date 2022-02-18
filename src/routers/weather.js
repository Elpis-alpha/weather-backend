const express = require('express')

const axios = require('axios')

const apiKey = process.env.WEATHER_API

const router = new express.Router()


// Sends get request to get weather by address
router.get('/api/weather/address', async (req, res) => {

  try {

    let locQuery = req.query.location

    if (/^Latitude:->[0-9]{0,3}, Longitude:->[0-9]{0,3}/.test(locQuery)) {

      locQuery = locQuery.replace('Latitude:->', '')

      locQuery = locQuery.replace(' Longitude:->', '')

    }

    let data = await axios(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${locQuery}&aqi=no`)

    data = data.data

    weatherData = {

      query: req.query.location,

      name: data.location.name,
      region: data.location.region,
      country: data.location.country,

      longitude: Math.round(data.location.lon),
      latitude: Math.round(data.location.lat),

      localTime: data.location.localtime,
      lastUpdated: data.current.last_updated,

      tempCelcius: data.current.temp_c,
      tempFaren: data.current.temp_f,

      tempCelcius_f: data.current.feelslike_c,
      tempFaren_f: data.current.feelslike_f,

      windDirection: data.current.wind_dir,
      windSpeedKPH: data.current.wind_kph,
      windSpeedMPH: data.current.wind_mph,

      gustSpeedKPH: data.current.gust_kph,
      gustSpeedMPH: data.current.gust_mph,

      weatherText: data.current.condition.text,
      weatherCode: data.current.condition.code,
    }

    res.status(200).send(weatherData)

  } catch (error) {

    res.status(500).send({ error: 'Server Error' })

  }

})


// Sends get request to get weather autocomplete
router.get('/api/weather/autocomplete', async (req, res) => {

  try {

    let data = await axios(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${req.query.location}`)

    data = data.data.slice(0, 5)

    const autoCompleteData = data.map(item => {

      return {
        id: item.id,
        name: item.name,
        region: item.region,
        country: item.country,
      }

    })

    res.status(200).send(autoCompleteData)

  } catch (error) {

    res.status(500).send({ error: 'Server Error' })

  }

})

module.exports = router
