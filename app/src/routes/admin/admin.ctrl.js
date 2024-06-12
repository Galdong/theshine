const db = require('../../config/db');
const crypto = require("../home/crypto");
const adminAccount = require("../../config/admin");
const util = require('util');

const output = {
    getAdmin: (req, res) => {
        if (req.session.auth == 'admin') {
            res.redirect("admin/main");
        } else {
            res.render("admin/adminLogin");
        }
    },
    getMain: async (req, res) => {
        const query = util.promisify(db.query).bind(db);
        async function fetchData() {
            try {
                const totalUsers = await query("SELECT COUNT(*) AS totalUsers FROM users WHERE category='user'");
                const newUsers = await query("SELECT COUNT(*) AS newUsers FROM users WHERE category='user' AND joinDate >= DATE_SUB(NOW(), INTERVAL 3 DAY)");
                const totalInstructors = await query("SELECT COUNT(*) AS totalInstructors FROM users WHERE category='instructor'");
                const newInstructors = await query("SELECT COUNT(*) AS newInstructors FROM users WHERE category='instructor' AND joinDate >= DATE_SUB(NOW(), INTERVAL 3 DAY)");
                const artApplyCount = await query("SELECT COUNT(*) AS artApplyCount FROM artapply");
                const proApplyCount = await query("SELECT COUNT(*) AS proApplyCount FROM proapply");
                const newArtApplyCount = await query("SELECT COUNT(*) AS newArtApplyCount FROM artapply WHERE applyDate >= DATE_SUB(NOW(), INTERVAL 3 DAY)");
                const newProApplyCount = await query("SELECT COUNT(*) AS newProApplyCount FROM proapply WHERE applyDate >= DATE_SUB(NOW(), INTERVAL 3 DAY)");
                const artWaitCount = await query("SELECT COUNT(*) AS artWaitCount FROM artapply WHERE applyStatus='wait'");
                const proWaitCount = await query("SELECT COUNT(*) AS proWaitCount FROM proapply WHERE applyStatus='wait'");
                const waitCount = parseInt(artWaitCount[0].artWaitCount) + parseInt(proWaitCount[0].proWaitCount);

                return {
                    totalUsers: totalUsers[0].totalUsers,
                    newUsers: newUsers[0].newUsers,
                    totalInstructors: totalInstructors[0].totalInstructors,
                    newInstructors: newInstructors[0].newInstructors,
                    artApplyCount: artApplyCount[0].artApplyCount,
                    proApplyCount: proApplyCount[0].proApplyCount,
                    newArtApplyCount: newArtApplyCount[0].newArtApplyCount,
                    newProApplyCount: newProApplyCount[0].newProApplyCount,
                    waitCount: artWaitCount[0].artWaitCount + proWaitCount[0].proWaitCount
                };
            } catch (err) {
                console.error('데이터 fetch 오류', err);
                throw err;
            }
        }
        const data = await fetchData();
        res.render("admin/adminList", { content: 'adminMain', data});
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
        const query = "SELECT id, name, mphone, joinDate, nickname FROM users WHERE category='user' ORDER BY joinDate DESC;";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("admin/adminList", {
                'data': result,
                'length': result.length,
                content : 'adminUsers'
            });
        });
    },
    getInstructors: (req, res) => {
        const query = "SELECT id, name, mphone, joinDate, nickname FROM users WHERE category='instructor' ORDER BY joinDate DESC;";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("admin/adminList", {
                'data': result,
                'length': result.length,
                content : 'adminInstructors'
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
            if (client.id === adminAccount.admin_id) {
                if (client.password === adminAccount.admin_pw) {
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
                if (data[0].applyStatus == 'complete') {
                    res.json({success : false, msg:'더 이상 변경할 수 없습니다.'});
                } else {
                    let query2;
                    if (data[0].applyStatus == 'wait') {
                        query2 = "UPDATE artapply SET applyStatus='confirm' WHERE applyID=?";
                    } else if (data[0].applyStatus == 'confirm') {
                        query2 = "UPDATE artapply SET applyStatus='complete' WHERE applyID=?";
                    } else {
                        res.json({success : false, msg : '신청상태가 잘못된 정보입니다.'});
                    }
                    db.query(query2, [data[0].applyID], (err, result) => {
                        if (err) console.log(err);
                        if (result) res.json({success : true});
                    });
                }
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
                if (data[0].applyStatus == 'complete') {
                    res.json({success : false, msg:'더 이상 변경할 수 없습니다.'});
                } else {
                    let query2;
                    if (data[0].applyStatus == 'wait') {
                        query2 = "UPDATE proapply SET applyStatus='confirm' WHERE applyID=?";
                    } else if (data[0].applyStatus == 'confirm') {
                        query2 = "UPDATE proapply SET applyStatus='complete' WHERE applyID=?";
                    } else {
                        res.json({success : false, msg : '신청상태가 잘못된 정보입니다.'});
                    }
                    db.query(query2, [data[0].applyID], (err, result) => {
                        if (err) console.log(err);
                        if (result) res.json({success : true});
                    });
                }
            }
        });
    },
    logout: (req, res) => {
        req.session.destroy(function(err) {
            res.redirect('/admin');
        });
    },
    deleteArtApply: (req, res) => {
        const title = req.body.title;
        const id = req.body.id;
        const applydate = req.body.applydate;
        const query = "DELETE FROM artapply WHERE title=? AND id=? AND applydate=?;";
        db.query(query, [title, id, applydate], (err, result) => {
            if (err) return console.log(err);
            if (result) res.json({success: true});
        });
    },
    deleteProApply: (req, res) => {
        const title = req.body.title;
        const id = req.body.id;
        const applydate = req.body.applydate;
        const query = "DELETE FROM proapply WHERE title=? AND id=? AND applydate=?;";
        db.query(query, [title, id, applydate], (err, result) => {
            if (err) return console.log(err);
            if (result) res.json({success: true});
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