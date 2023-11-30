const db = require('../../config/db');
const Edu = require("../../models/edu/Edu");

const output = {
    getAdmin: (req, res) => {
        res.render("admin/adminList")
    },
    getAuth: (req, res) => {
        const query = "SELECT * FROM authcode;";
        db.query(query, (err,result) => {
            if (err) console.log(err);
            if (result) res.render("admin/adminAuthcode", {'code': result[0].code});
        })
    },
    getApplylist: (req, res) => {
        const query = "SELECT * FROM apply ORDER BY applydate DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("admin/adminApplylist", {
                'data': result,
                'length': result.length,
            });
        });
    },
    getUsers: (req, res) => {
        const query = "SELECT id, name, address, mphone, cat, in_date, nickname FROM users ORDER BY in_date DESC;";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("admin/adminUsers", {
                'data': result,
                'length': result.length
            });
        });
    }
}

const process = {
    postWrite: async (req, res) => {
        const nickname = req.session.nickname;
        const edu = new Edu(req.body);
        const response = await edu.post(nickname);
        return res.json(response);
    },
    postEdit: async (req, res) => {
        const boardno = req.params.boardno;
        if (isNaN(boardno)) {
            parseInt(boardno);
        } else {
            const updatedate = new Date();
            const query = "UPDATE eduboard SET title=?, content=?, instructor_name=?, category=?, edu_period=?, recruit_num=?, receipt_period=?, location=?, status=?, UPDATE_DATE=? WHERE BOARD_NO=?;";
            const dbdata = [
                req.body.title,
                req.body.content,
                req.body.instructor_name,
                req.body.category,
                req.body.edu_period,
                req.body.recruit_num,
                req.body.receipt_period,
                req.body.location,
                req.body.status,
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
        const query = "DELETE FROM eduboard WHERE BOARD_NO = ?;";
        db.query(query, [boardno], (err, result) => {
            if (err) return console.log(err);
            if (result) res.json({success: true});
        });
    },
    postApply: (req, res) => {
        const boardno = parseInt(req.params.boardno);
        const nickname = req.session.nickname;
        const query = "SELECT eduboard.BOARD_NO, eduboard.title, eduboard.category, eduboard.status, users.name, users.nickname, users.address, users.mphone FROM eduboard INNER JOIN users ON eduboard.nickname = users.nickname WHERE BOARD_NO = ?;";
        const applydate = new Date();
        db.query(query, [boardno], (err, result) => {
            if (err) console.log(err);
            if (result) {
                const query2 = "INSERT INTO apply (BOARD_NO, title, category, status, name, nickname, address, mphone, applydate) values (?, ?, ?, ?, ?, ?, ?, ?, ?);";
                dbdata = [
                    boardno,
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