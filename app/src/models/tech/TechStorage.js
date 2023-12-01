const db = require('../../config/db');

exports.postData = async(data, nickname) => { 
    const postdate = new Date();
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO techboard (title, content, nickname, instructor_name, category, edu_period, recruit_num, receipt_period, location, status, POST_DATE, UPDATE_DATE) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
            const dbdata = [
                data.title,
                data.content,
                nickname,
                data.instructor_name,
                data.category,
                data.edu_period,
                data.recruit_num,
                data.receipt_period,
                data.location,
                data.status,
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
        const query = "UPDATE techboard SET title=?, content=?, instructor_name=?, category=?, edu_period=?, recruit_num=?, receipt_period=?, location=?, status=?, UPDATE_DATE=? WHERE BOARD_NO=?;";
        const dbdata = [
            data.title,
            data.content,
            data.instructor_name,
            data.category,
            data.edu_period,
            data.recruit_num,
            data.receipt_period,
            data.location,
            data.status,
            updatedate,
            boardno
        ];
        db.query(query, dbdata, (err, result) => {
            if (err) reject(`${err}`);
            else resolve({success: true});
        });        
    });
}