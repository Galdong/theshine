const UserStorage = require("../../models/home/UserStorage");
const auth = require("./auth");
const crypto = require("./crypto");
const { sendMessage } = require('../../config/message');

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
    }
    // getFindpw: (req, res) => {
    //     res.render("home/findpw");
    // },
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
    }

    
    // findpw: async (req, res) => {
    //     const query = "SELECT email FROM users WHERE id= ?;";
    //     db.query(query, req.body.id, (err, result) => {
    //         if (err) console.log(err);
    //         if (result) {
    //             const number = UserStorage.generateRandom(111111, 999999);
    //             const email = result[0].email;
    //             const maskingEmail = UserStorage.emailSecurity(email);
    //             const mailOptions = {
    //                 from : "qwe3488@naver.com",
    //                 to : email,
    //                 subject : "챌린지 플러스 인증코드입니다.",
    //                 html : '<h1>인증번호 :'+ number +'</h1>'
    //             }
    //             smtpTransport.sendMail(mailOptions, (err, response) => {
    //                 console.log("response", response);
    //                 if (err) {
    //                     res.json({success: false, msg: '메일 전송에 실패하였습니다.'});
    //                     smtpTransport.close() // 전송종료
    //                 } else {
    //                     res.render("home/findpw2", {'data': result, 'code': number, 'maskingEmail': maskingEmail});
    //                 }
    //             });
    //         }
    //     });  
    // },
};

module.exports = {
    output,
    process
};