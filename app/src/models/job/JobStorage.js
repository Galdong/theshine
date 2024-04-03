const db = require('../../config/db');

exports.postData = async(data, nickname, image) => { 
    const postdate = new Date();
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO jobboard (title, content, companyName, industry, project, startDate, employeeNum, ceoName, postDate, nickname, filename) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
            const dbdata = [
                data.title,
                data.content,
                data.companyName,
                data.industry,
                data.project,
                data.startDate,
                data.employeeNum,
                data.ceoName,
                postdate,
                nickname,
                image
            ];
            db.query(query, dbdata, (err, result) => {
                if (err) reject(`${err}`);
                else resolve({success: true});
            });        
    });
}
exports.editData = async(data, postID, image) => {
    const updateDate = new Date();
    return new Promise((resolve, reject) => {
        const query = "UPDATE jobboard SET title=?, content=?, companyName=?, industry=?, project=?, startDate=?, employeeNum=?, ceoName=?, updateDate=?, filename=? WHERE postID=?;";
            const dbdata = [
                data.title,
                data.content,
                data.companyName,
                data.industry,
                data.project,
                data.startDate,
                data.employeeNum,
                data.ceoName,
                updateDate,
                image,
                postID
            ];
            db.query(query, dbdata, (err, result) => {
                if (err) reject(`${err}`);
                else resolve({success: true});
            });        
    });
}