const db = require("../../config/db");
const PicnicStorage = require("./PicnicStorage");


class Picnic {
    constructor(body) {
        this.body = body;
    }

    async post(nickname, image, imageOriginalName) {
        const client = this.body;
        try {
            const response = await PicnicStorage.postData(client, nickname, image, imageOriginalName);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
}

module.exports = Picnic;