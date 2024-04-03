const db = require("../../config/db");
const ClubStorage = require("./ClubStorage");


class Club {
    constructor(body) {
        this.body = body;
    }

    async post(nickname, image) {
        const client = this.body;
        try {
            const response = await ClubStorage.postData(client, nickname, image);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
    async edit(postID) {
        const client = this.body;
        try {
            const response = await ClubStorage.editData(client, postID, image);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
    
}

module.exports = Club;