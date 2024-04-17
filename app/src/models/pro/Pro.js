const db = require("../../config/db");
const ProStorage = require("./ProStorage");


class Pro {
    constructor(body) {
        this.body = body;
    }

    async post(nickname, image, imageOriginalName) {
        const client = this.body;
        try {
            const response = await ProStorage.postData(client, nickname, image, imageOriginalName);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
}

module.exports = Pro;