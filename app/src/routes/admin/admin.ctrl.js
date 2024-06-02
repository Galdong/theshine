const db = require('../../config/db');
const crypto = require("../home/crypto");

const output = {
    getAdmin: (req, res) => {
        if (req.session.auth == 'admin') {
            res.redirect("admin/main");
        } else {
            res.render("admin/adminLogin");
        }
    },
    getMain: (req, res) => {
        res.render("admin/adminList", { content: 'adminMain'});
    },
    getAuth: (req, res) => {
        const query = "SELECT * FROM authcode;";
        db.query(query, (err,result) => {
            if (err) console.log(err);
            if (result) res.render("admin/adminList", {content: 'adminAuthcode', 'code': result[0].code});
        })
    },
    getArtApplylist: (req, res) => {
        const query = "SELECT * FROM artapply ORDER BY applydate DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("admin/adminList", {
                'data': result,
                'length': result.length,
                content : 'adminArtApplylist'
            });
        });
    },
    getProApplylist: (req, res) => {
        const query = "SELECT * FROM proapply ORDER BY applydate DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("admin/adminList", {
                'data': result,
                'length': result.length,
                content : 'adminProApplylist'
            });
        });
    },
    getUsers: (req, res) => {
        const query = "SELECT id, name, address, mphone, category, joinDate, nickname FROM users ORDER BY joinDate DESC;";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("admin/adminList", {
                'data': result,
                'length': result.length,
                content : 'adminUsers'
            });
        });
    },
    getMessage: (req, res) => {
        const query = "SELECT * FROM users;";
        db.query(query, (err, result) => {
            res.render("admin/adminList", {
                content: 'adminMessage',
                users: result,
               });
        });
    },
}

const process = {
    ResetPwd: async (req, res) => {
        const id = req.body.id;
        const { password, salt } = await crypto.createHashedPassword('123456789a');
        const query = "UPDATE users SET password=?, salt=? WHERE id=?;";
        db.query(query, [password, salt, id], (err, result) => {
            if (err) console.log(err);
            if (result) res.json({success: true});
        });
    },
    adminLogin: (req, res) => {
        const client = req.body;
        try {
            if (client.id === "admin") {
                if (client.password === "1234") {
                    req.session.auth = 'admin';
                    req.session.cookie.maxAge = 30*60*1000; // 세션만료시간 30분 설정
                    req.session.save(function() {
                        return res.json({ success : true });
                    });
                } else {
                    return res.json({ success : false, msg : "비밀번호가 틀렸습니다."});
                }
            } else {
                return res.json({ success : false, msg : "존재하지 않는 아이디입니다."});
            }
        } catch (err) {
            return res.json({ success: false, msg: `${err}`});
        }
    },
    ArtChangeStatus: (req, res) => {
        const title = req.body.title;
        const id = req.body.id;
        const applydate = req.body.applydate;
        const query1 = "SELECT applyID, applyStatus from artapply WHERE title=? AND id=? AND applydate=?;";
        db.query(query1, [title, id, applydate], (err, data) => {
            if (err) console.log(err);
            if (data) { 
                let query2;
                switch (data[0].applyStatus) {
                    case 'wait':
                        query2 = "UPDATE artapply SET applyStatus='confirm' WHERE applyID=?";
                        break;
                    case 'confirm':
                        query2 = "UPDATE artapply SET applyStatus='complete' WHERE applyID=?";
                        break;
                    case 'complete':
                        query2 = "UPDATE artapply SET applyStatus='wait' WHERE applyID=?";
                        break;
                    default:
                        console.log("신청현황이 잘못된 정보입니다.");
                        return;
                }
                db.query(query2, [data[0].applyID], (err, result) => {
                    if (err) console.log(err);
                    if (result) res.json({success : true});
                });
            }
        });
    },
    ProChangeStatus: (req, res) => {
        const title = req.body.title;
        const id = req.body.id;
        const applydate = req.body.applydate;
        const query1 = "SELECT applyID, applyStatus from proapply WHERE title=? AND id=? AND applydate=?;";
        db.query(query1, [title, id, applydate], (err, data) => {
            if (err) console.log(err);
            if (data) { 
                let query2;
                switch (data[0].applyStatus) {
                    case 'wait':
                        query2 = "UPDATE proapply SET applyStatus='confirm' WHERE applyID=?";
                        break;
                    case 'confirm':
                        query2 = "UPDATE proapply SET applyStatus='complete' WHERE applyID=?";
                        break;
                    case 'complete':
                        query2 = "UPDATE proapply SET applyStatus='wait' WHERE applyID=?";
                        break;
                    default:
                        console.log("신청현황이 잘못된 정보입니다.");
                        return;
                }
                db.query(query2, [data[0].applyID], (err, result) => {
                    if (err) console.log(err);
                    if (result) res.json({success : true});
                });
            }
        });
    }
    
}

const session = {
    sessionExpiration: (req, res, next) => {
        if (req.session && req.session.auth === 'admin') {
            next();
        } else {
            res.render("admin/adminAlert");
        }
    }
}

module.exports = {
    output, process, session
};