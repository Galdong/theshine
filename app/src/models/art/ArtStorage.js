const db = require('../../config/db');

exports.postData = async(data, nickname, image) => { 
    const postdate = new Date();
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO CulturalArtEdu (title, content, nickname, instructorName, category, eduPeriod, recruitNum, receptionPeriod, place, status, postDate, filename) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
            const dbdata = [
                data.title,
                data.content,
                nickname,
                data.instructorName,
                data.category,
                data.eduPeriod,
                data.recruitNum,
                data.receptionPeriod,
                data.place,
                data.status,
                postdate,
                image
            ];
            db.query(query, dbdata, (err, result) => {
                if (err) reject(`${err}`);
                else resolve({success: true});
            });        
    });
}
exports.editData = async(data, postID) => {
    const updatedate = new Date();
    return new Promise((resolve, reject) => {
        const query = "UPDATE CulturalArtEdu SET title=?, content=?, instructorName=?, category=?, eduPeriod=?, recruitNum=?, receptionPeriod=?, place=?, status=?, updateDate=? WHERE postID=?;";
        const dbdata = [
            data.title,
            data.content,
            data.instructorName,
            data.category,
            data.eduPeriod,
            data.recruitNum,
            data.receptionPeriod,
            data.place,
            data.status,
            updatedate,
            postID
        ];
        db.query(query, dbdata, (err, result) => {
            if (err) reject(`${err}`);
            else resolve({success: true});
        });        
    });
}