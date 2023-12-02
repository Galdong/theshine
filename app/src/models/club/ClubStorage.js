const db = require('../../config/db');

exports.postData = async(data, nickname, image) => { 
    const postdate = new Date();
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO clubboard (title, content, nickname, POST_DATE, UPDATE_DATE, filename) values (?, ?, ?, ?, ?, ?);"
            const dbdata = [
                data.title,
                data.content,
                nickname,
                postdate,
                postdate,
                image
            ];
            db.query(query, dbdata, (err, result) => {
                if (err) reject(`${err}`);
                else resolve({success: true});
            });        
    });
}
exports.editData = async(data, boardno) => {
    const updatedate = new Date();
    return new Promise((resolve, reject) => {
        const query = "UPDATE clubboard SET title=?, content=?, UPDATE_DATE=? WHERE BOARD_NO=?;";
            const dbdata = [
                data.title,
                data.content,
                updatedate,
                boardno
            ];
            db.query(query, dbdata, (err, result) => {
                if (err) reject(`${err}`);
                else resolve({success: true});
            });        
    });
}