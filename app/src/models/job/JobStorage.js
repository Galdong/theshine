const db = require('../../config/db');

exports.postData = async(data, nickname, image) => { 
    const postdate = new Date();
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO jobboard (title, content, companyname, sector, businessinfo, startdate, employeenum, ceoname, POST_DATE, UPDATE_DATE, nickname, filename) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
            const dbdata = [
                data.title,
                data.content,
                data.companyname,
                data.sector,
                data.businessinfo,
                data.startdate,
                data.employeenum,
                data.ceoname,
                postdate,
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
exports.editData = async(data, boardno) => {
    const updatedate = new Date();
    return new Promise((resolve, reject) => {
        const query = "UPDATE jobboard SET title=?, content=?, companyname=?, sector=?, businessinfo=?, startdate=?, employeenum=?, ceoname=?, UPDATE_DATE=? WHERE BOARD_NO=?;";
            const dbdata = [
                data.title,
                data.content,
                data.companyname,
                data.sector,
                data.businessinfo,
                data.startdate,
                data.employeenum,
                data.ceoname,
                updatedate,
                boardno
            ];
            db.query(query, dbdata, (err, result) => {
                if (err) reject(`${err}`);
                else resolve({success: true});
            });        
    });
}