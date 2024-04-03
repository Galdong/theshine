const db = require("../../config/db");
const ArtStorage = require("./ArtStorage");


class Art {
    constructor(body) {
        this.body = body;
    }

    async post(nickname, image) {
        const client = this.body;
        try {
            const response = await ArtStorage.postData(client, nickname, image);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
    async edit(postID) {
        const client = this.body;
        try {
            const response = await ArtStorage.editData(client, postID);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
    
}

module.exports = Art;