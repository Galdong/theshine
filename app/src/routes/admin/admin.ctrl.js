const db = require('../../config/db');

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
    getArteApplylist: (req, res) => {
        const query = "SELECT * FROM arteapply ORDER BY applydate DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("admin/adminArteApplylist", {
                'data': result,
                'length': result.length,
            });
        });
    },
    getTechApplylist: (req, res) => {
        const query = "SELECT * FROM techapply ORDER BY applydate DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("admin/adminTechApplylist", {
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

module.exports = {
    output,
};