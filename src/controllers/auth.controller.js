'use strict'

const authService = require("../services/auth.service");
const userService = require('../services/user.service')
const { responseWithNoTokens, responseWithTokens } = require("../utils/response");

class AuthController {

    signIn = (req, res) => {
        const { email, password } = req.body
        authService.signIn(email, password)
            .then(user => responseWithNoTokens(req, res, user, 200))
            .catch(error => {
                console.log(error)
                return responseWithNoTokens(req, res, error.message, 500)
            })
    }

    signUpStep1 = (req, res) => {
        const { email, password } = req.body
        authService.signUpStep1(email, password)
            .then(userCreated => responseWithNoTokens(req, res, userCreated, 200))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }

    sendVerifyCode = (req, res) => {
        const { email, subject, content } = req.body
        authService.sendVerifyCode(email, subject, content)
    }

    completeInformation = (req, res) => {
        const user = req.body
        authService.completeInformation(user)
            .then(userUpdated => responseWithNoTokens(req, res, userUpdated, 200))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }

    verifyCode = (req, res) => {
        const { email, code } = req.body
        authService.verifyCode(email, code)
            .then(userUpdated => responseWithNoTokens(req, res, userUpdated, 200))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }

    signUpStepOther = (req, res) => {
        const user = req.body
        authService.signUpStepOther(user)
            .then(userUpdate => responseWithNoTokens(req, res, userUpdate, 200))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }

    generateToken = (req, res) => {
        const { id } = req.body
        authService.generateTokens({ user_id: id })
            .then(tokens => responseWithNoTokens(req, res, tokens, 200))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }

    findUserByToken = async (req, res) => {
        const user = await userService.getByID(req.userid)
        return responseWithTokens(req, res, user, 200)
    }

    getNewPassword = async (req, res) => {
        const { email } = req.body
        authService.getNewPassword(email)
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }
}

module.exports = new AuthController()