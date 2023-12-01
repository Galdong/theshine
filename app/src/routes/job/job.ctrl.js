const db = require('../../config/db');
const Job = require("../../models/job/Job");

const output = {
    getJob: (req, res) => {
        const query = "SELECT * FROM jobboard ORDER BY BOARD_NO DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("job/jobList", {
                'data':result,
                'length':result.length - 1,
                'page': 1,
                'page_num': 10,
            });
        });
    },
    getList: (req, res) => {
        const page = parseInt(req.params.page);
        const query = "SELECT * FROM jobboard ORDER BY BOARD_NO DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("job/jobList", {
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
            const query = "SELECT * FROM jobboard where BOARD_NO = ?";
            db.query(query, [boardno], (err, result) => {
                if (err) console.log(err);
                if (result) res.render("job/jobView", {'data':result});
            });
        }   
    },
    getWrite: (req, res) => {
        const nickname = req.session.nickname;
        res.render("job/jobWrite", {'nickname':nickname});
    },
    getEdit: (req, res) => {
        const boardno = parseInt(req.params.boardno);
        const nickname = req.session.nickname;
        const query = "SELECT * FROM jobboard where BOARD_NO = ?";
        db.query(query, [boardno], (err, result) => {
            if (err) console.log(err);
            if (result) {
                if (result[0].nickname !== nickname) {
                    res.send("<script>alert('본인이 작성한 글만 수정할 수 있습니다.');location.href=history.back();</script>");
                } else {
                    res.render("job/jobEdit", {'data':result, 'nickname':nickname});
                }
            }
        });    
    },  
}

const process = {
    postWrite: async (req, res) => {
        const nickname = req.session.nickname;
        const job = new Job(req.body);
        const response = await job.post(nickname);
        return res.json(response);
    },
    postEdit: async (req, res) => {
        const boardno = req.params.boardno;
        if (isNaN(boardno)) {
            parseInt(boardno);
        } else {
            const updatedate = new Date();
            const query = "UPDATE jobboard SET title=?, content=?, companyname=?, sector=?, businessinfo=?, startdate=?, employeenum=?, ceoname=?, UPDATE_DATE=? WHERE BOARD_NO=?;";
            const dbdata = [
                req.body.title,
                req.body.content,
                req.body.companyname,
                req.body.sector,
                req.body.businessinfo,
                req.body.startdate,
                req.body.employeenum,
                req.body.ceoname,
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
        const query1 = "SELECT * FROM jobboard where BOARD_NO = ?";
        db.query(query1, [boardno], (err, result) => {
            if (err) console.log(err);
            if (result) {
                if (result[0].nickname !== nickname) {
                    res.send("<script>alert('본인이 작성한 글만 삭제할 수 있습니다.');location.href=history.back();</script>");
                } else {
                    const query2 = "DELETE FROM jobboard WHERE BOARD_NO = ?;";
                    db.query(query2, [boardno], (err, result) => {
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