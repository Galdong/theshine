const db = require('../../config/db');

exports.postData = async(data, nickname, image, imageOriginalName) => { 
    const postdate = new Date();
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO jobboard (title, content, companyName, industry, project, startDate, employeeNum, ceoName, postDate, nickname, filename, fileOriginalName) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
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
                image,
                imageOriginalName
            ];
            db.query(query, dbdata, (err, result) => {
                if (err) reject(`${err}`);
                else resolve({success: true});
            });        
    });
}