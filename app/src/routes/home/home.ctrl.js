const UserStorage = require("../../models/home/UserStorage");
const User = require("../../models/home/User");
const auth = require("./auth");
const crypto = require("./crypto");

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
    }
};

const process = {
    login: async (req, res) => {
        try{
            const client = req.body;
            const user = await UserStorage.getUserInfo(client.id);
                // getUserInfo가 다 실행되기 전에 실행되지 말라고 비동기처리 await
                // await을 호출하기 위해 login에 async 붙이기
            const password = await crypto.makePasswordHashed(client.id, client.password);
            if (user) {
                if (user.id === client.id && password === user.password) {
                    req.session.is_logined = true;
                    req.session.nickname = user.nickname;
                    req.session.auth = user.cat; // 사용자 유형에따라 권한부여
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
        const user = new User(req.body);
        const response = await user.registerc();
        return res.json(response);
    },
    registerp: async (req, res) => {
        const user = new User(req.body);
        const response = await user.registerp();
        return res.json(response);
    },
};

module.exports = {
    output,
    process
};