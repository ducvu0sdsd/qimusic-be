'use strict'

const userModel = require("../models/user.model")
const authUtils = require("../utils/auth")
const jwt = require('jsonwebtoken');
const { sendMail, generateRandomNumber } = require("../utils/mailer");

class UserService {

    getByID = async (id) => {
        const user = await userModel.findById(id)
        return user
    }

    update = async (user) => {
        const userUpdated = await userModel.findByIdAndUpdate(user._id, user, { new: true })
        return userUpdated
    }
}

module.exports = new UserService()