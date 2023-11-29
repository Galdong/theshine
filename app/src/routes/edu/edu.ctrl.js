const db = require('../../config/db');
const Edu = require("../../models/edu/Edu");

const output = {
    getEdu: (req, res) => {
        const query = "SELECT * FROM eduboard ORDER BY BOARD_NO DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("edu/eduList", {
                'data':result,
                'length':result.length - 1,
                'page': 1,
                'page_num': 10,
            });
        });
    },
    getList: (req, res) => {
        const page = parseInt(req.params.page);
        const query = "SELECT * FROM eduboard ORDER BY BOARD_NO DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("edu/eduList", {
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
            const query = "SELECT * FROM eduboard where BOARD_NO = ?";
            db.query(query, [boardno], (err, result) => {
                if (err) console.log(err);
                if (result) res.render("edu/eduView", {'data':result});
            });
        }   
    },
    getWrite: (req, res) => {
        const nickname = req.session.nickname;
        res.render("edu/eduWrite", {'nickname':nickname});
    },
    getEdit: (req, res) => {
        const boardno = parseInt(req.params.boardno);
        const nickname = req.session.nickname;
        const query = "SELECT * FROM eduboard where BOARD_NO = ?";
        db.query(query, [boardno], (err, result) => {
            if (err) console.log(err);
            if (result) {
                if (result[0].nickname !== nickname) {
                    res.send("<script>alert('본인이 작성한 글만 수정할 수 있습니다.');location.href=history.back();</script>");
                } else {
                    res.render("edu/eduEdit", {'data':result, 'nickname':nickname});
                }
            }
        });    
    },
    
    getDelete: (req, res) => {
        const boardno = parseInt(req.params.boardno);
        const nickname = req.session.nickname;
        const query = "SELECT * FROM eduboard where BOARD_NO = ?";
        db.query(query, [boardno], (err, result) => {
            if (err) console.log(err);
            if (result) {
                if (result[0].nickname !== nickname) {
                    res.send("<script>alert('본인이 작성한 글만 삭제할 수 있습니다.');location.href=history.back();</script>");
                } else {
                    res.render("edu/eduDelete", {'nickname':nickname});
                }
            }
        }); 
    },  
    getApply: (req, res) => {
        res.send("<script>alert('신청이 완료되었습니다.');location.href='/edu';</script>");
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