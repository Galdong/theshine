const db = require("../../config/db");
const HobbyStorage = require("./HobbyStorage");


class Hobby {
    constructor(body) {
        this.body = body;
    }

    async post(nickname) {
        const client = this.body;
        try {
            const response = await HobbyStorage.postData(client, nickname);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
    async edit(boardno) {
        const client = this.body;
        try {
            const response = await HobbyStorage.editData(client, boardno);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
    
}

module.exports = Hobby;