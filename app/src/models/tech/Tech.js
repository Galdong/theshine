const db = require("../../config/db");
const TechStorage = require("./TechStorage");


class Tech {
    constructor(body) {
        this.body = body;
    }

    async post(nickname) {
        const client = this.body;
        try {
            const response = await TechStorage.postData(client, nickname);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
    async edit(boardno) {
        const client = this.body;
        try {
            const response = await TechStorage.editData(client, boardno);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
    
}

module.exports = Tech;