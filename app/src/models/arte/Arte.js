const db = require("../../config/db");
const ArteStorage = require("./ArteStorage");


class Arte {
    constructor(body) {
        this.body = body;
    }

    async post(nickname) {
        const client = this.body;
        try {
            const response = await ArteStorage.postData(client, nickname);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
    async edit(boardno) {
        const client = this.body;
        try {
            const response = await ArteStorage.editData(client, boardno);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
    
}

module.exports = Arte;