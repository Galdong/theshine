const UserStorage = require("../../models/home/UserStorage");
const auth = require("./auth");
const crypto = require("./crypto");
const { sendMessage } = require('../../config/message');
const db = require("../../config/db");

const output = {
    home: (req, res) => {
        auth.status(req,res);
        res.render("home/index", {
            'nickname':auth.status(req,res).split(',')[0],
            'tag':auth.status(req,res).split(',')[1]});
    },
    login: (req, res) => {
        res.render("home/login");
    },
    logout: (req, res) => {
        req.session.destroy(function(err) {
            res.redirect('/');
        });
    },
    registerc: (req, res) => {
        res.render("home/registerc"); // 일반이용자 회원가입
    },
    registerp: (req, res) => {
        res.render("home/registerp"); // 공급자 회원가입
    },
    registercat: (req, res) => {
        res.render("home/registercat");
    },
    getVerify: (req, res) => {
        const mphone = req.session.mphone;
        res.render("home/verify", { mphone });
    },
    getFindID: (req, res) => {
        res.render("home/findID")
    },
    getFindID2: (req, res) => {
        const mphone = req.query.mphone;
        res.render("home/findID2", { mphone });
    },
    getFindID3: (req, res) => {
        const userID = req.session.userID;
        res.render("home/findID3", { userID });
    },
    getFindPW: (req, res) => {
        res.render("home/findPW");
    },
    getFindPW2: (req, res) => {
        const mphone = req.query.mphone;
        res.render("home/findPW2", { mphone });
    },
    getResetPW: (req, res) => {
        res.render("home/resetPW");
    }
};

const process = {
    login: async (req, res) => {
        try{
            const client = req.body;
            const user = await UserStorage.getUserInfo(client.id);
                // getUserInfo가 다 실행되기 전에 실행되지 말라고 비동기처리 await
                // await을 호출하기 위해 login에 async 붙이기
            if (user) {
                const password = await crypto.makePasswordHashed(client.id, client.password);
                // if문 밖에 선언하니 crypto모듈 undefined떠서 if문 내로 수정
                if (user.id === client.id && password === user.password) {
                    req.session.is_logined = true;
                    req.session.nickname = user.nickname;
                    req.session.auth = user.category; // 사용자 유형에따라 권한부여
                    req.session.save(function() {
                        return res.json({ success : true });
                    });
                }
                else return res.json({ success : false, msg: "비밀번호가 틀렸습니다."});
            }
            else return res.json({ success : false, msg: "존재하지 않는 아이디입니다."}); 
        } catch (err) {
            return res.json({ success: false, msg: `${err}`});
        }

    },
    registerc: async (req, res) => {
        try {
            const client = req.body;
            const response = await UserStorage.savec(client);
            return res.json(response);
        } catch (err) {
            return res.json({ success: false, msg: `${err}`});
        }
    },
    registerp: async (req, res) => {
        try {
            const client = req.body;
            const user = await UserStorage.getAuthcode(client.code);
            if (user) {
                const response = await UserStorage.savep(client);
                return res.json(response);
            }
            else return res.json({ success: false, msg: "인증코드가 틀립니다." });
        } catch (err) {
            return res.json({ success: false, msg: `${err}`});
        }
    },
    verify: async (req, res) => {
        const to = req.body.mphone;
        function generateRandomCode() {
            const randomNum = Math.floor(Math.random() * 1000000);
            return String(randomNum).padStart(6, '0');
        }
        const randomCode = generateRandomCode();
        const content = `[챌린지 플러스] 인증번호 [${randomCode}] 입니다.`;

        try {
            await sendMessage(to, content);
            req.session.randomCode = randomCode;
            req.session.codeExpiry = Date.now() + 1000 * 60 * 5 // 인증코드 만료시간 5분
            res.json({success: true});
        } catch (err) {
            res.json({success: false, msg:'메시지 전송 실패'});
        }
    },
    verifycode: (req, res) => {
        const userCode = req.body.verificationCode;
        const sessionCode = req.session.randomCode;
        const codeExpiry = req.session.codeExpiry;

        if (Date.now() > codeExpiry) {
            return res.json({success : false, msg : '인증 시간이 만료되었습니다.'});
        }
        
        if (userCode === sessionCode) {
            res.json({success : true});
        } else { 
            res.json({success : false, msg : '인증번호가 일치하지 않습니다.'});
        }
    },
    findID: (req, res) => {
        const name = req.body.name;
        const mphone = req.body.mphone;
        const query = "SELECT * FROM users WHERE name=? AND mphone=?";
        db.query(query, [name,mphone], (err, result) => {
            if (err) console.log(err);
            if (result.length === 0) {
                res.json({success: false, msg:'일치하는 아이디가 없습니다.'});
            } else {
                function generateRandomCode() {
                    const randomNum = Math.floor(Math.random() * 1000000);
                    return String(randomNum).padStart(6, '0');
                }
                const randomCode = generateRandomCode();
                const content = `[챌린지 플러스] 인증번호 [${randomCode}] 입니다.`;
                sendMessage(mphone, content);
                req.session.userID = result[0].id;
                req.session.randomCode = randomCode;
                req.session.codeExpiry = Date.now() + 1000 * 60 * 5
                res.json({success: true, mphone});
            }
        });
    },
    findID2: (req, res) => {
        const userCode = req.body.verificationCode;
        const sessionCode = req.session.randomCode;
        const codeExpiry = req.session.codeExpiry;
        if (Date.now() > codeExpiry) {
            return res.json({success : false, msg : '인증 시간이 만료되었습니다.'});
        }
        if (userCode === sessionCode) {
            res.json({success : true});
        } else { 
            res.json({success : false, msg : '인증번호가 일치하지 않습니다.'});
        }
    },
    findPW: (req, res) => {
        const id = req.body.id;
        const name = req.body.name;
        const mphone = req.body.mphone;
        const query = "SELECT * FROM users WHERE id=? AND name=? AND mphone=?";
        db.query(query, [id, name,mphone], (err, result) => {
            if (err) console.log(err);
            if (result.length === 0) {
                res.json({success: false, msg:'일치하는 아이디가 없습니다.'});
            } else {
                function generateRandomCode() {
                    const randomNum = Math.floor(Math.random() * 1000000);
                    return String(randomNum).padStart(6, '0');
                }
                const randomCode = generateRandomCode();
                const content = `[챌린지 플러스] 인증번호 [${randomCode}] 입니다.`;
                sendMessage(mphone, content);
                req.session.userID = id;
                req.session.randomCode = randomCode;
                req.session.codeExpiry = Date.now() + 1000 * 60 * 5
                res.json({success: true, mphone});
            }
        });
    },
    findPW2: (req, res) => {
        const userCode = req.body.verificationCode;
        const sessionCode = req.session.randomCode;
        const codeExpiry = req.session.codeExpiry;
        if (Date.now() > codeExpiry) {
            return res.json({success : false, msg : '인증 시간이 만료되었습니다.'});
        }
        if (userCode === sessionCode) {
            res.json({success : true});
        } else { 
            res.json({success : false, msg : '인증번호가 일치하지 않습니다.'});
        }
    },
    resetPW: async (req, res) => {
        const id = req.session.userID;
        const { password, salt } = await crypto.createHashedPassword(req.body.password);
        const query = "UPDATE users SET password = ?, salt = ? WHERE id = ?";
        db.query(query, [password, salt, id], (err, result) => {
            if (err) res.json({succeess: false, msg:err});
            if (result) res.json({success: true});
        })
    }
};

module.exports = {
    output,
    process
};