const db = require("../../config/db");
const EduStorage = require("./EduStorage");


class Edu {
    constructor(body) {
        this.body = body;
    }

    async post(nickname) {
        const client = this.body;
        try {
            const response = await EduStorage.postData(client, nickname);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
    async edit(boardno) {
        const client = this.body;
        try {
            const response = await EduStorage.editData(client, boardno);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
    
}

module.exports = Edu;