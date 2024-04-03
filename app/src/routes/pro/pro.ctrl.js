const db = require('../../config/db');
const Pro = require("../../models/pro/Pro");
const fs = require('fs');
const path = require('path');

const output = {
    getPro: (req, res) => {
        const query = "SELECT * FROM ProfessionalEdu ORDER BY postID DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("pro/proMain", {
                'data':result,
                'length':result.length - 1,
                'page': 1,
                'page_num': 10,
            });
        });
    },
    getList: (req, res) => {
        const page = parseInt(req.params.page);
        const query = "SELECT * FROM ProfessionalEdu ORDER BY postID DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("pro/proMain", {
                'data':result,
                'length':result.length - 1,
                'page': page,
                'page_num': 10,
            });
        });
    },
    getCat: (req, res) => {
        const category = req.params.category;
        const query = "SELECT * FROM ProfessionalEdu WHERE category = ? ORDER BY postID DESC";
        db.query(query, [category], (err, result) => {
            if (err) console.log(err);
            if (result) res.render("pro/proList", {
                'data':result,
                'length':result.length - 1,
                'page': 1,
                'page_num': 10,
                'category': category,
            });
        });
    },
    getCatpage: (req, res) => {
        const category = req.params.category;
        const page = parseInt(req.params.page);
        const query = "SELECT * FROM ProfessionalEdu WHERE category = ? ORDER BY postID DESC";
        db.query(query, [category], (err, result) => {
            if (err) console.log(err);
            if (result) res.render("pro/proList", {
                'data':result,
                'length':result.length - 1,
                'page': page,
                'page_num': 10,
                'category': category,
            });
        });
    },
    getView: (req, res) => {
        const postID = req.params.postID;
        if (isNaN(postID)) {
            parseInt(postID);
        } else {
            const query = "SELECT * FROM ProfessionalEdu where postID = ?";
            db.query(query, [postID], (err, result) => {
                if (err) console.log(err);
                if (result) res.render("pro/proView", {'data':result});
            });
        }   
    },
    getWrite: (req, res) => {
        const nickname = req.session.nickname;
        res.render("pro/proWrite", {'nickname':nickname});
    },
    getEdit: (req, res) => {
        const postID = parseInt(req.params.postID);
        const nickname = req.session.nickname;
        const query = "SELECT * FROM ProfessionalEdu where postID = ?";
        db.query(query, [postID], (err, result) => {
            if (err) console.log(err);
            if (result) {
                if (result[0].nickname !== nickname) {
                    res.send("<script>alert('본인이 작성한 글만 수정할 수 있습니다.');location.href=history.back();</script>");
                } else {
                    res.render("pro/proEdit", {'data':result, 'nickname':nickname});
                }
            }
        });    
    },
    getApply: (req, res) => {
        res.send("<script>alert('신청이 완료되었습니다.');location.href='/pro';</script>");
    },
    getView2: (req, res) => {
        const postID = req.params.postID;
        if (isNaN(postID)) {
            parseInt(postID);
        } else {
            const query = "SELECT * FROM ProfessionalEdu where postID = ?";
            db.query(query, [postID], (err, result) => {
                if (err) console.log(err);
                if (result) res.render("pro/proView", {'data':result});
            });
        }   
    },
}

const process = {
    postWrite: async (req, res) => {
        const nickname = req.session.nickname;
        const image = req.file.filename;
        const pro = new Pro(req.body);
        const response = await pro.post(nickname, image);
        return res.json(response);
    },
    postEdit: async (req, res) => {
        const postID = req.params.postID;
        const image = req.file.filename;
        const data = req.body;
        if (isNaN(postID)) {
            parseInt(postID);
        } else {
            const updatedate = new Date();
            const query = "UPDATE ProfessionalEdu SET title=?, content=?, instructorName=?, category=?, eduPeriod=?, recruitNum=?, receptionPeriod=?, place=?, status=?, updateDate=?, filename=? WHERE postID=?;";
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
                image,
                postID,
            ];
            db.query(query, dbdata, (err, result) => {
                if (err) console.log(err);
                if (result) res.json({success: true});
            }); 
        }
    },
    postDelete: (req, res) => {
        const postID = parseInt(req.params.postID);
        const nickname = req.session.nickname;
        const query1 = "SELECT * FROM ProfessionalEdu where postID = ?";
        db.query(query1, [postID], (err, result) => {
            if (err) console.log(err);
            if (result) {
                if (result[0].nickname !== nickname) {
                    res.send("<script>alert('본인이 작성한 글만 삭제할 수 있습니다.');location.href=history.back();</script>");
                } else {
                    const filename = result[0].filename;
                    const filepath = path.join(__dirname, "../../public/images/") + filename;
                    fs.unlink(filepath, (err) => { 
                        if (err) {
                            console.error(err);
                            return
                        }
                    });
                    const query2 = "DELETE FROM ProfessionalEdu WHERE postID = ?;";
                    db.query(query2, [postID], (err, result) => {
                        if (err) return console.log(err);
                        if (result) res.json({success: true});
                    });
                }
            }
        }); 
    },
    postApply: (req, res) => {
        const postID = parseInt(req.params.postID);
        const nickname = req.session.nickname;
        const query = "SELECT ProfessionalEdu.postID, ProfessionalEdu.title, ProfessionalEdu.category, ProfessionalEdu.status, users.name, users.nickname, users.address, users.mphone FROM ProfessionalEdu INNER JOIN users ON ProfessionalEdu.nickname = users.nickname WHERE postID = ?;";
        const applydate = new Date();
        db.query(query, [postID], (err, result) => {
            if (err) console.log(err);
            if (result) {
                const query2 = "INSERT INTO proapply (postID, title, category, status, name, nickname, address, mphone, applydate) values (?, ?, ?, ?, ?, ?, ?, ?, ?);";
                dbdata = [
                    postID,
                    result[0].title,
                    result[0].category,
                    result[0].status,
                    result[0].name,
                    result[0].nickname,
                    result[0].address,
                    result[0].mphone,
                    applydate
                ];
                db.query(query2, dbdata, (err, data) => {
                    if (err) console.log(err);
                    if (data) res.json({success: true});
                });
            }
        });
    }
}

const isLogined = (req, res, next) => {
    const is_logined = req.session.is_logined;
    if(!is_logined) {
        res.send("<script>alert('로그인이 필요한 서비스입니다.');location.href='/login';</script>");
    } else {
        next();
    }
}
module.exports = {
    output,
    process,
    isLogined
};