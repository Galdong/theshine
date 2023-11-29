const db = require('../../config/db');
const Hobby = require("../../models/hobby/Hobby");

const output = {
    getHobby: (req, res) => {
        const query = "SELECT * FROM hobbyboard ORDER BY BOARD_NO DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("hobby/hobbyList", {
                'data':result,
                'length':result.length - 1,
                'page': 1,
                'page_num': 10,
            });
        });
    },
    getList: (req, res) => {
        const page = parseInt(req.params.page);
        const query = "SELECT * FROM hobbyboard ORDER BY BOARD_NO DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("hobby/hobbyList", {
                'data':result,
                'length':result.length - 1,
                'page': page,
                'page_num': 10,
            });
        });
    },
    getView: (req, res) => {
        const boardno = req.params.boardno;
        if (isNaN(boardno)) {
            parseInt(boardno);
        } else {
            const query = "SELECT * FROM hobbyboard where BOARD_NO = ?";
            db.query(query, [boardno], (err, result) => {
                if (err) console.log(err);
                if (result) res.render("hobby/hobbyView", {'data':result});
            });
        }   
    },
    getWrite: (req, res) => {
        const nickname = req.session.nickname;
        res.render("hobby/hobbyWrite", {'nickname':nickname});
    },
    getEdit: (req, res) => {
        const boardno = parseInt(req.params.boardno);
        const nickname = req.session.nickname;
        const query = "SELECT * FROM hobbyboard where BOARD_NO = ?";
        db.query(query, [boardno], (err, result) => {
            if (err) console.log(err);
            if (result) {
                if (result[0].nickname !== nickname) {
                    res.send("<script>alert('본인이 작성한 글만 수정할 수 있습니다.');location.href=history.back();</script>");
                } else {
                    res.render("hobby/hobbyEdit", {'data':result, 'nickname':nickname});
                }
            }
        });    
    },
    
    getDelete: (req, res) => {
        const boardno = parseInt(req.params.boardno);
        const nickname = req.session.nickname;
        const query = "SELECT * FROM hobbyboard where BOARD_NO = ?";
        db.query(query, [boardno], (err, result) => {
            if (err) console.log(err);
            if (result) {
                if (result[0].nickname !== nickname) {
                    res.send("<script>alert('본인이 작성한 글만 삭제할 수 있습니다.');location.href=history.back();</script>");
                } else {
                    res.render("hobby/hobbyDelete", {'nickname':nickname});
                }
            }
        }); 
    },  
}

const process = {
    postWrite: async (req, res) => {
        const nickname = req.session.nickname;
        const hobby = new Hobby(req.body);
        const response = await hobby.post(nickname);
        return res.json(response);
    },
    postEdit: async (req, res) => {
        const boardno = req.params.boardno;
        if (isNaN(boardno)) {
            parseInt(boardno);
        } else {
            const updatedate = new Date();
            const query = "UPDATE hobbyboard SET title=?, content=?, UPDATE_DATE=? WHERE BOARD_NO=?;";
            const dbdata = [
                req.body.title,
                req.body.content,
                updatedate,
                boardno
            ];
            db.query(query, dbdata, (err, result) => {
                if (err) console.log(err);
                if (result) res.json({success: true});
            });
        }
    },
    postDelete: (req, res) => {
        const boardno = parseInt(req.params.boardno);
        const nickname = req.session.nickname;
        const query = "DELETE FROM hobbyboard WHERE BOARD_NO = ?;";
        db.query(query, [boardno], (err, result) => {
            if (err) return console.log(err);
            if (result) res.json({success: true});
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