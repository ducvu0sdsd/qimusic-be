'use strict'

const userModel = require("../models/user.model")
const bcrypt = require('bcryptjs');
const authUtils = require("../utils/auth")
const jwt = require('jsonwebtoken');
const { sendMail, generateRandomNumber } = require("../utils/mailer");
let QUEUE_VERIFICATIONS = []

class AuthService {

    signUpStep1 = async (email, password) => {
        const user = await userModel.findOne({ email })
        if (user)
            throw new Error('Email already in the system')
        else {
            const passwordEncode = await authUtils.hashPassword(password)
            const userResult = await userModel.create({ email, password: passwordEncode, statusSignUp: 1 })
            userResult.password = ''
            return userResult
        }
    }

    sendVerifyCode = async (email, subject, content) => {
        const founded = QUEUE_VERIFICATIONS.filter(item => item.email === email)[0]
        if (founded) {
            sendMail(email, subject, content + founded.code)
        } else {
            const randomNumber = generateRandomNumber()
            QUEUE_VERIFICATIONS.push({ email, code: randomNumber })
            sendMail(email, subject, content + randomNumber)
        }
    }

    verifyCode = async (email, code) => {
        const founded = QUEUE_VERIFICATIONS.filter(item => item.email === email)[0]
        if (founded) {
            if (founded.code === code) {
                const userFound = await userModel.findOne({ email })
                const userUpdated = await userModel.findByIdAndUpdate(userFound._id, { ...userFound.toObject(), statusSignUp: 2 }, { new: true })
                QUEUE_VERIFICATIONS = QUEUE_VERIFICATIONS.filter(item => item.email !== email)
                return userUpdated
            } else {
                throw new Error(`Verification Code Don't Match`)
            }
        } else {
            throw new Error('Verification Code Invalid')
        }
    }

    completeInformation = async (user) => {
        const userUpdated = await userModel.findByIdAndUpdate(user._id, { ...user, statusSignUp: 3 }, { new: true })
        return userUpdated
    }

    signIn = async (email, pass) => {
        try {
            const user = await userModel.findOne({ email })
            const isMatch = await bcrypt.compare(pass, user.password);
            user.password = ''
            if (isMatch) {
                return {
                    user,
                    tokens: await this.generateTokens({ user_id: user._id })
                }
            } else {
                throw new Error(`Information Don't Match`);
            }
        } catch (error) {
            throw new Error('Not Found Account');
        }
    }

    generateTokens = async (user, expire) => {
        const accessToken = jwt.sign(user, process.env.SECRETKEY, { expiresIn: process.env.ACCESSEXPIRES });
        const refreshToken = jwt.sign(user, process.env.SECRETKEY, { expiresIn: expire ? expire : process.env.REFRESHEXPIRES });
        return {
            accessToken,
            refreshToken
        }
    }

    getNewPassword = async (email) => {
        const user = await userModel.findOne({ email })
        if (user) {
            const randomNumber = generateRandomNumber()
            const passwordEncode = await authUtils.hashPassword(randomNumber)
            await userModel.findByIdAndUpdate(user._id, { ...user.toObject(), password: passwordEncode }, { new: true })
            sendMail(email, 'Get new Password', 'New Password: ' + randomNumber)
        } else {
            throw new Error('Not Found Account');
        }
    }
}

module.exports = new AuthService()