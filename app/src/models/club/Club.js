const db = require("../../config/db");
const ClubStorage = require("./ClubStorage");


class Club {
    constructor(body) {
        this.body = body;
    }

    async post(nickname, image, imageOriginalName) {
        const client = this.body;
        try {
            const response = await ClubStorage.postData(client, nickname, image, imageOriginalName);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
}

module.exports = Club;