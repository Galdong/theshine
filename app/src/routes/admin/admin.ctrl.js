const db = require('../../config/db');
const crypto = require("../home/crypto");

const output = {
    getAdmin: (req, res) => {
        res.render("admin/adminLogin");
    },
    getMain: (req, res) => {
        res.render("admin/adminList");
    },
    getAuth: (req, res) => {
        const query = "SELECT * FROM authcode;";
        db.query(query, (err,result) => {
            if (err) console.log(err);
            if (result) res.render("admin/adminAuthcode", {'code': result[0].code});
        })
    },
    getArtApplylist: (req, res) => {
        const query = "SELECT * FROM artapply ORDER BY applydate DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("admin/adminArtApplylist", {
                'data': result,
                'length': result.length,
            });
        });
    },
    getProApplylist: (req, res) => {
        const query = "SELECT * FROM proapply ORDER BY applydate DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("admin/adminProApplylist", {
                'data': result,
                'length': result.length,
            });
        });
    },
    getUsers: (req, res) => {
        const query = "SELECT id, name, address, mphone, category, joinDate, nickname FROM users ORDER BY joinDate DESC;";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("admin/adminUsers", {
                'data': result,
                'length': result.length
            });
        });
    },
    getResetPwd: (req, res) => {
        const id = req.params.id;
        res.render("admin/ResetPassword", {'id': id});
    }
}

const process = {
    ResetPwd: async (req, res) => {
        const id = req.params.id;
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