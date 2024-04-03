const db = require('../../config/db');
const Art = require("../../models/art/Art");
const fs = require('fs');
const path = require('path');

const output = {
    getArt: (req, res) => {
        const query = "SELECT * FROM CulturalArtEdu ORDER BY postID DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("art/artMain", {
                'data':result,
                'length':result.length - 1,
                'page': 1,
                'page_num': 10,
            });
        });
    },
    getList: (req, res) => {
        const page = parseInt(req.params.page);
        const query = "SELECT * FROM CulturalArtEdu ORDER BY postID DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("art/artMain", {
                'data':result,
                'length':result.length - 1,
                'page': page,
                'page_num': 10,
            });
        });
    },
    getCat: (req, res) => {
        const category = req.params.category;
        const query = "SELECT * FROM CulturalArtEdu WHERE category = ? ORDER BY postID DESC";
        db.query(query, [category], (err, result) => {
            if (err) console.log(err);
            if (result) res.render("art/artList", {
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
        const query = "SELECT * FROM CulturalArtEdu WHERE category = ? ORDER BY postID DESC";
        db.query(query, [category], (err, result) => {
            if (err) console.log(err);
            if (result) res.render("art/artList", {
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
            const query = "SELECT * FROM CulturalArtEdu where postID = ?";
            db.query(query, [postID], (err, result) => {
                if (err) console.log(err);
                if (result) res.render("art/artView", {'data':result});
            });
        }   
    },
    getWrite: (req, res) => {
        const nickname = req.session.nickname;
        res.render("art/artWrite", {'nickname':nickname});
    },
    getEdit: (req, res) => {
        const postID = parseInt(req.params.postID);
        const nickname = req.session.nickname;
        const query = "SELECT * FROM CulturalArtEdu where postID = ?";
        db.query(query, [postID], (err, result) => {
            if (err) console.log(err);
            if (result) {
                if (result[0].nickname !== nickname) {
                    res.send("<script>alert('본인이 작성한 글만 수정할 수 있습니다.');location.href=history.back();</script>");
                } else {
                    res.render("art/artEdit", {'data':result, 'nickname':nickname});
                }
            }
        });    
    },
    getApply: (req, res) => {
        res.send("<script>alert('신청이 완료되었습니다.');location.href='/art';</script>");
    },
    getView2: (req, res) => {
        const postID = req.params.postID;
        if (isNaN(postID)) {
            parseInt(postID);
        } else {
            const query = "SELECT * FROM CulturalArtEdu where postID = ?";
            db.query(query, [postID], (err, result) => {
                if (err) console.log(err);
                if (result) res.render("art/artView", {'data':result});
            });
        }   
    },
}

const process = {
    postWrite: async (req, res) => {
        const nickname = req.session.nickname;
        const image = req.file.filename;
        const art = new Art(req.body);
        const response = await art.post(nickname, image);
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
            const query = "UPDATE CulturalArtEdu SET title=?, content=?, instructorName=?, category=?, eduPeriod=?, recruitNum=?, receptionPeriod=?, place=?, status=?, updateDate=?, filename=? WHERE postID=?;";
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
        const query1 = "SELECT * FROM CulturalArtEdu where postID = ?";
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
                    const query2 = "DELETE FROM CulturalArtEdu WHERE postID = ?;";
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
        const query = "SELECT CulturalArtEdu.postID, CulturalArtEdu.title, CulturalArtEdu.category, CulturalArtEdu.status, users.name, users.nickname, users.address, users.mphone FROM CulturalArtEdu INNER JOIN users ON CulturalArtEdu.nickname = users.nickname WHERE postID = ?;";
        const applydate = new Date();
        db.query(query, [postID], (err, result) => {
            if (err) console.log(err);
            if (result) {
                const query2 = "INSERT INTO arteapply (postID, title, category, status, name, nickname, address, mphone, applydate) values (?, ?, ?, ?, ?, ?, ?, ?, ?);";
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