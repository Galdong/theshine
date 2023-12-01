const db = require("../../config/db");
const ClubStorage = require("./ClubStorage");


class Club {
    constructor(body) {
        this.body = body;
    }

    async post(nickname) {
        const client = this.body;
        try {
            const response = await ClubStorage.postData(client, nickname);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
    async edit(boardno) {
        const client = this.body;
        try {
            const response = await ClubStorage.editData(client, boardno);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
    
}

module.exports = Club;