const db = require('../../config/db');

exports.postData = async(data, nickname) => { 
    const postdate = new Date();
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO hobbyboard (title, content, nickname, POST_DATE, UPDATE_DATE) values (?, ?, ?, ?, ?);"
            const dbdata = [
                data.title,
                data.content,
                nickname,
                postdate,
                postdate,
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
        const query = "UPDATE hobbyboard SET title=?, content=?, UPDATE_DATE=? WHERE BOARD_NO=?;";
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