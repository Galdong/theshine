const db = require("../../config/db");
const JobStorage = require("./JobStorage");


class Job {
    constructor(body) {
        this.body = body;
    }

    async post(nickname, image, imageOriginalName) {
        const client = this.body;
        try {
            const response = await JobStorage.postData(client, nickname, image, imageOriginalName);
            return response;
        } catch (err) {
            return { success: false, msg: `${err}` };
        }
    }
}

module.exports = Job;