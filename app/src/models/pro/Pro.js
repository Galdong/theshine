const db = require("../../config/db");
const ProStorage = require("./ProStorage");


class Pro {
    constructor(body) {
        this.body = body;
    }

    async post(nickname, image) {
        const client = this.body;
        try {
            const response = await ProStorage.postData(client, nickname, image);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
    async edit(postID) {
        const client = this.body;
        try {
            const response = await ProStorage.editData(client, postID);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
    
}

module.exports = Pro;