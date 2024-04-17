const db = require('../../config/db');

exports.postData = async(data, nickname, image, imageOriginalName) => { 
    const postdate = new Date();
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO ProfessionalEdu (title, content, nickname, instructorName, category, eduPeriod, recruitNum, receptionPeriod, place, status, postDate, filename, fileOriginalName) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
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
                image,
                imageOriginalName
            ];
            db.query(query, dbdata, (err, result) => {
                if (err) reject(`${err}`);
                else resolve({success: true});
            });        
    });
}