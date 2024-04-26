const db = require("../../config/db");
const FreeStorage = require("./FreeStorage");


class Free {
    constructor(body) {
        this.body = body;
    }

    async post(nickname, image, imageOriginalName) {
        const client = this.body;
        try {
            const response = await FreeStorage.postData(client, nickname, image, imageOriginalName);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
}

module.exports = Free;