'use strict'

const express = require('express')
const router = express.Router()
const MusicController = require('../../controllers/MusicController')

router.post('/find', MusicController.find)

module.exports = router  