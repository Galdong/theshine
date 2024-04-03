const db = require("../../config/db");
const JobStorage = require("./JobStorage");


class Job {
    constructor(body) {
        this.body = body;
    }

    async post(nickname, image) {
        const client = this.body;
        try {
            const response = await JobStorage.postData(client, nickname, image);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
    async edit(postID) {
        const client = this.body;
        try {
            const response = await JobStorage.editData(client, postID, image);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
    
}

module.exports = Job;