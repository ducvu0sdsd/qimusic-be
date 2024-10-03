'use strict'
const { responseWithNoTokens, responseWithTokens } = require("../utils/response");

class MusicController {

    find = async (req, res) => {
        const { ask } = req.body
        const targetUrl = `http://ac.mp3.zing.vn/complete?type=artist,song,key,code&num=500&query=${ask}`;

        try {
            const response = await fetch(targetUrl);
            const data = await response.json();

            responseWithNoTokens(req, res, data, 200)
        } catch (error) {
            responseWithNoTokens(req, res, error.message, 500)
        }
    }
}

module.exports = new MusicController()