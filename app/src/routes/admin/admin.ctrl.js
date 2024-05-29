const db = require('../../config/db');
const crypto = require("../home/crypto");

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
    }
}

module.exports = {
    output, process
};