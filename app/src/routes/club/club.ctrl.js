const db = require('../../config/db');
const Club = require("../../models/club/Club");
const fs = require('fs');
const path = require('path');

const output = {
    getClub: (req, res) => {
        const query = "SELECT * FROM clubboard ORDER BY postID DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("club/clubList", {
                'data':result,
                'length':result.length - 1,
                'page': 1,
                'page_num': 10,
            });
        });

    },
    getList: (req, res) => {
        const page = parseInt(req.params.page);
        const query = "SELECT * FROM clubboard ORDER BY postID DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("club/clubList", {
                'data':result,
                'length':result.length - 1,
                'page': page,
                'page_num': 10,
            });
        });
    },
    getView: (req, res) => {
        const postID = req.params.postID;
        if (isNaN(postID)) {
            parseInt(postID);
        } else {
            const query = "SELECT * FROM clubboard where postID = ?";
            db.query(query, [postID], (err, result) => {
                if (err) console.log(err);
                if (result) res.render("club/clubView", {'data':result});
            });
        }   
    },
    getWrite: (req, res) => {
        const nickname = req.session.nickname;
        res.render("club/clubWrite", {'nickname':nickname});
    },
    getEdit: (req, res) => {
        const postID = parseInt(req.params.postID);
        const nickname = req.session.nickname;
        const query = "SELECT * FROM clubboard where postID = ?";
        db.query(query, [postID], (err, result) => {
            if (err) console.log(err);
            if (result) {
                if (result[0].nickname !== nickname) {
                    res.send("<script>alert('본인이 작성한 글만 수정할 수 있습니다.');location.href=history.back();</script>");
                } else {
                    res.render("club/clubEdit", {'data':result, 'nickname':nickname});
                }
            }
        });    
    },
}

const process = {
    postWrite: async (req, res) => {
        const nickname = req.session.nickname;
        const image = req.file.filename;
        const club = new Club(req.body);
        const response = await club.post(nickname, image);
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
            const query = "UPDATE clubboard SET title=?, content=?, updateDate=?, filename=? WHERE postID=?;";
            const dbdata = [
                data.title,
                data.content,
                updatedate,
                image,
                postID
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
        const query1 = "SELECT * FROM clubboard where postID = ?";
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
                    const query2 = "DELETE FROM clubboard WHERE postID = ?;";
                    db.query(query2, [postID], (err, result) => {
                        if (err) return console.log(err);
                        if (result) res.json({success: true});
                    });
                }
            }
        }); 
    },
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