const db = require('../../config/db');

exports.postData = async(data, nickname, image) => { 
    const postdate = new Date();
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO clubboard (title, content, nickname, postDate, filename) values (?, ?, ?, ?, ?);"
            const dbdata = [
                data.title,
                data.content,
                nickname,
                postdate,
                image
            ];
            db.query(query, dbdata, (err, result) => {
                if (err) reject(`${err}`);
                else resolve({success: true});
            });        
    });
}
exports.editData = async(data, postID, image) => {
    const updatedate = new Date();
    return new Promise((resolve, reject) => {
        const query = "UPDATE clubboard SET title=?, content=?, updateDate=?, filename=? WHERE postID=?;";
            const dbdata = [
                data.title,
                data.content,
                updatedate,
                image,
                postID
            ];
            db.query(query, dbdata, (err, result) => {
                if (err) reject(`${err}`);
                else resolve({success: true});
            });        
    });
}