const db = require('../../config/db');
const crypto = require("../home/crypto");
const adminAccount = require("../../config/admin");
const util = require('util');
const sendMessage = require('../../config/message');
const { deleteFileFromS3 } = require('../../config/multer');

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
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const offset = (page - 1) * limit;

        const totalQuery = "SELECT COUNT(*) as total FROM artapply";
        db.query(totalQuery, (err, totalResult) => {
            if (err) console.log(err);
            const totalCount = totalResult[0].total;
            const totalPages = Math.ceil(totalCount / limit);
            const query = "SELECT * FROM artapply ORDER BY applydate DESC LIMIT ? OFFSET ?";
            db.query(query, [limit, offset], (err, result) => {
                if (err) console.log(err);
                if (result) res.render("admin/adminList", {
                    data: result,
                    length: result.length,
                    currentPage: page,
                    totalPages: totalPages,
                    content: 'adminArtApplyList'
                });
            });
        });
    },
    getProApplylist: (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const offset = (page - 1) * limit;

        const totalQuery = "SELECT COUNT(*) as total FROM proapply";
        db.query(totalQuery, (err, totalResult) => {
            if (err) console.log(err);
            const totalCount = totalResult[0].total;
            const totalPages = Math.ceil(totalCount / limit);
            const query = "SELECT * FROM proapply ORDER BY applydate DESC LIMIT ? OFFSET ?";
            db.query(query, [limit, offset], (err, result) => {
                if (err) console.log(err);
                if (result) res.render("admin/adminList", {
                    data: result,
                    length: result.length,
                    currentPage: page,
                    totalPages: totalPages,
                    content: 'adminProApplyList'
                });
            });
        });
    },
    getUsers: (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const offset = (page - 1) * limit;

        const totalQuery = "SELECT COUNT(*) as total FROM users WHERE category='user'";
        db.query(totalQuery, (err, totalResult) => {
            if (err) console.log(err);
            const totalCount = totalResult[0].total;
            const totalPages = Math.ceil(totalCount / limit);
            const query = "SELECT * FROM users WHERE category='user' ORDER BY joinDate DESC LIMIT ? OFFSET ?";
            db.query(query, [limit, offset], (err, result) => {
                if (err) console.log(err);
                if (result) res.render("admin/adminList", {
                    data: result,
                    length: result.length,
                    currentPage: page,
                    totalPages: totalPages,
                    content: 'adminUsers'
                });
            });
        });
    },
    getInstructors: (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const offset = (page - 1) * limit;

        const totalQuery = "SELECT COUNT(*) as total FROM users WHERE category='instructor'";
        db.query(totalQuery, (err, totalResult) => {
            if (err) console.log(err);
            const totalCount = totalResult[0].total;
            const totalPages = Math.ceil(totalCount / limit);
            const query = "SELECT * FROM users WHERE category='instructor' ORDER BY joinDate DESC LIMIT ? OFFSET ?";
            db.query(query, [limit, offset], (err, result) => {
                if (err) console.log(err);
                if (result) res.render("admin/adminList", {
                    data: result,
                    length: result.length,
                    currentPage: page,
                    totalPages: totalPages,
                    content: 'adminInstructors'
                });
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
    getArtlist: (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const offset = (page - 1) * limit;

        const totalQuery = "SELECT COUNT(*) as total FROM CulturalArtEdu";
        db.query(totalQuery, (err, totalResult) => {
            if (err) console.log(err);
            const totalCount = totalResult[0].total;
            const totalPages = Math.ceil(totalCount / limit);
            const query = "SELECT * FROM CulturalArtEdu ORDER BY postDate DESC LIMIT ? OFFSET ?";
            db.query(query, [limit, offset], (err, result) => {
                if (err) console.log(err);
                if (result) res.render("admin/adminList", {
                    data: result,
                    length: result.length,
                    currentPage: page,
                    totalPages: totalPages,
                    content: 'adminArtList'
                });
            });
        });
    },
    getProlist: (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const offset = (page - 1) * limit;

        const totalQuery = "SELECT COUNT(*) as total FROM ProfessionalEdu";
        db.query(totalQuery, (err, totalResult) => {
            if (err) console.log(err);
            const totalCount = totalResult[0].total;
            const totalPages = Math.ceil(totalCount / limit);
            const query = "SELECT * FROM ProfessionalEdu ORDER BY postDate DESC LIMIT ? OFFSET ?";
            db.query(query, [limit, offset], (err, result) => {
                if (err) console.log(err);
                if (result) res.render("admin/adminList", {
                    data: result,
                    length: result.length,
                    currentPage: page,
                    totalPages: totalPages,
                    content: 'adminProList'
                });
            });
        });
    },
    getArtview: (req, res) => {
        const postID = req.params.postID;
        const query1 = "SELECT COUNT(*) AS applyNum FROM artapply WHERE postID = ?;";
        db.query(query1, [postID], (error, results) => {
            if (error) throw error;
            let applyNum = results[0].applyNum;
            if (applyNum === null) {
                applyNum = 0;
            }
            const query2 = "SELECT * FROM CulturalArtEdu WHERE postID=? ORDER BY postDate DESC;";
            db.query(query2, [postID], (err, result) => {
                if (err) console.log(err);
                if (result) res.render("admin/adminList", {
                    'data': result,
                    'imageNum':JSON.parse(result[0].filename).length,
                    'image':JSON.parse(result[0].filename),
                    content : 'adminArtView',
                    applyNum
                });
            });
        });
    },
    getProview: (req, res) => {
        const postID = req.params.postID;
        const query1 = "SELECT COUNT(*) AS applyNum FROM proapply WHERE postID = ?;";
        db.query(query1, [postID], (error, results) => {
            if (error) throw error;
            let applyNum = results[0].applyNum;
            if (applyNum === null) {
                applyNum = 0;
            }
            const query2 = "SELECT * FROM ProfessionalEdu WHERE postID=? ORDER BY postDate DESC;";
            db.query(query2, [postID], (err, result) => {
                if (err) console.log(err);
                if (result) res.render("admin/adminList", {
                    'data': result,
                    'imageNum':JSON.parse(result[0].filename).length,
                    'image':JSON.parse(result[0].filename),
                    content : 'adminProView',
                    applyNum
                });
            });
        });
    },
    getArtWrite: (req, res) => {
        res.render("admin/adminList", { content: 'adminArtWrite'});
    },
    getProWrite: (req, res) => {
        res.render("admin/adminList", { content: 'adminProWrite'});
    },
    getArtSearch: (req, res) => {
        const keyword = req.query.keyword.toUpperCase();
        const filter = req.query.filter;

        const query = "SELECT * FROM CulturalArtEdu";
        db.query(query, (err, data) => {
            if (err) console.log(err);
            if (data) {
                const result = data.filter(item => {
                    return item[filter].toUpperCase().includes(keyword);
                });
                res.json(result);
            }
        });
    },
    getProSearch: (req, res) => {
        const keyword = req.query.keyword.toUpperCase();
        const filter = req.query.filter;

        const query = "SELECT * FROM ProfessionalEdu";
        db.query(query, (err, data) => {
            if (err) console.log(err);
            if (data) {
                const result = data.filter(item => {
                    return item[filter].toUpperCase().includes(keyword);
                });
                res.json(result);
            }
        });
    },
    getFreelist: (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const offset = (page - 1) * limit;

        const totalQuery = "SELECT COUNT(*) as total FROM freeboard";
        db.query(totalQuery, (err, totalResult) => {
            if (err) console.log(err);
            const totalCount = totalResult[0].total;
            const totalPages = Math.ceil(totalCount / limit);
            const query = "SELECT * FROM freeboard ORDER BY postDate DESC LIMIT ? OFFSET ?";
            db.query(query, [limit, offset], (err, result) => {
                if (err) console.log(err);
                if (result) res.render("admin/adminList", {
                    data: result,
                    length: result.length,
                    currentPage: page,
                    totalPages: totalPages,
                    content: 'adminFreeList'
                });
            });
        });
    },
    getFreeview: (req, res) => {
        const postID = req.params.postID;
        const query = "SELECT * FROM freeboard WHERE postID=? ORDER BY postDate DESC;";
        db.query(query, [postID], (err, result) => {
            if (err) console.log(err);
            if (result) res.render("admin/adminList", {
                'data': result,
                'imageNum':JSON.parse(result[0].filename).length,
                'image':JSON.parse(result[0].filename),
                content : 'adminFreeView'
            });
        });
    },
    getFreeWrite: (req, res) => {
        res.render("admin/adminList", { content: 'adminFreeWrite'});
    },
    getFreeSearch: (req, res) => {
        const keyword = req.query.keyword.toUpperCase();
        const filter = req.query.filter;

        const query = "SELECT * FROM freeboard";
        db.query(query, (err, data) => {
            if (err) console.log(err);
            if (data) {
                const result = data.filter(item => {
                    return item[filter].toUpperCase().includes(keyword);
                });
                res.json(result);
            }
        });
    },
    getClublist: (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const offset = (page - 1) * limit;

        const totalQuery = "SELECT COUNT(*) as total FROM clubboard";
        db.query(totalQuery, (err, totalResult) => {
            if (err) console.log(err);
            const totalCount = totalResult[0].total;
            const totalPages = Math.ceil(totalCount / limit);
            const query = "SELECT * FROM clubboard ORDER BY postDate DESC LIMIT ? OFFSET ?";
            db.query(query, [limit, offset], (err, result) => {
                if (err) console.log(err);
                if (result) res.render("admin/adminList", {
                    data: result,
                    length: result.length,
                    currentPage: page,
                    totalPages: totalPages,
                    content: 'adminClubList'
                });
            });
        });
    },
    getClubview: (req, res) => {
        const postID = req.params.postID;
        const query = "SELECT * FROM clubboard WHERE postID=? ORDER BY postDate DESC;";
        db.query(query, [postID], (err, result) => {
            if (err) console.log(err);
            if (result) res.render("admin/adminList", {
                'data': result,
                'imageNum':JSON.parse(result[0].filename).length,
                'image':JSON.parse(result[0].filename),
                content : 'adminClubView'
            });
        });
    },
    getClubWrite: (req, res) => {
        res.render("admin/adminList", { content: 'adminClubWrite'});
    },
    getClubSearch: (req, res) => {
        const keyword = req.query.keyword.toUpperCase();
        const filter = req.query.filter;

        const query = "SELECT * FROM clubboard";
        db.query(query, (err, data) => {
            if (err) console.log(err);
            if (data) {
                const result = data.filter(item => {
                    return item[filter].toUpperCase().includes(keyword);
                });
                res.json(result);
            }
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
        const query1 = "SELECT applyID, applyStatus, name, mphone from artapply WHERE title=? AND id=? AND applydate=?;";
        db.query(query1, [title, id, applydate], (err, data) => {
            if (err) console.log(err);
            if (data) {
                const to = data[0].mphone; 
                if (data[0].applyStatus == 'complete') {
                    res.json({success : false, msg:'더 이상 변경할 수 없습니다.'});
                } else {
                    let query2;
                    if (data[0].applyStatus == 'wait') {
                        query2 = "UPDATE artapply SET applyStatus='confirm' WHERE applyID=?";
                        const content = `[챌린지플러스] ${data[0].name} 님 신청하신 교육이 입금 확인되었습니다.`
                        sendMessage(to, content);
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
        const query1 = "SELECT applyID, applyStatus, name, mphone from proapply WHERE title=? AND id=? AND applydate=?;";
        db.query(query1, [title, id, applydate], (err, data) => {
            if (err) console.log(err);
            if (data) { 
                const to = data[0].mphone; 
                if (data[0].applyStatus == 'complete') {
                    res.json({success : false, msg:'더 이상 변경할 수 없습니다.'});
                } else {
                    let query2;
                    if (data[0].applyStatus == 'wait') {
                        query2 = "UPDATE proapply SET applyStatus='confirm' WHERE applyID=?";
                        const content = `[챌린지플러스] ${data[0].name} 님 신청하신 교육이 입금 확인되었습니다.`
                        sendMessage(to, content);
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
    },
    deleteArtPost: (req, res) => {
        const postID = req.params.postID;
        const query1 = "SELECT * FROM CulturalArtEdu WHERE postID = ?";
        db.query(query1, [postID], (err, result) => {
            if (err) console.log(err);
            if (result) {
                const filename = JSON.parse(result[0].filename);
                const fileNum = filename.length;
                for (i=0; i<fileNum; i++) {
                    const key = filename[i];
                    deleteFileFromS3(key);
                }
                const query2 = "DELETE FROM CulturalArtEdu WHERE postID = ?;";
                db.query(query2, [postID], (err, result) => {
                    if (err) return console.log(err);
                    if (result) res.json({success: true});
                });
            }
        }); 
    },
    deleteProPost: (req, res) => {
        const postID = req.params.postID;
        const query1 = "SELECT * FROM ProfessionalEdu WHERE postID = ?";
        db.query(query1, [postID], (err, result) => {
            if (err) console.log(err);
            if (result) {
                const filename = JSON.parse(result[0].filename);
                const fileNum = filename.length;
                for (i=0; i<fileNum; i++) {
                    const key = filename[i];
                    deleteFileFromS3(key);
                }
                const query2 = "DELETE FROM ProfessionalEdu WHERE postID = ?;";
                db.query(query2, [postID], (err, result) => {
                    if (err) return console.log(err);
                    if (result) res.json({success: true});
                });
            }
        }); 
    },
    ArtWrite: (req, res) => {
        const data = req.body;
        let images = [];
        for (var i=0; i < req.files.length; i++) {
            images.push(req.files[i].key.split('/').pop());
        }
        const image = JSON.stringify(images);
        let imagesOriginalName = [];
        for (var i=0; i < req.files.length; i++) {
            imagesOriginalName.push(req.files[i].originalname);
        }
        const imageOriginalName = JSON.stringify(imagesOriginalName);
        const postDate = new Date();
        const query = "INSERT INTO CulturalArtEdu (title, content, nickname, instructorName, category, eduPeriod, recruitNum, receptionPeriod, status, postDate, filename, fileOriginalName, price) values (?, ?, '관리자', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        const dbdata = [
            data.title,
            data.content,
            data.instructorName,
            data.category,
            data.eduPeriod,
            data.recruitNum,
            data.receptionPeriod,
            data.status,
            postDate,
            image,
            imageOriginalName,
            data.price
        ];
        db.query(query, dbdata, (err, result) => {
            if (err) return console.log(err);
            if (result) res.json({success: true});
        });
    },
    ProWrite: (req, res) => {
        const data = req.body;
        let images = [];
        for (var i=0; i < req.files.length; i++) {
            images.push(req.files[i].key.split('/').pop());
        }
        const image = JSON.stringify(images);
        let imagesOriginalName = [];
        for (var i=0; i < req.files.length; i++) {
            imagesOriginalName.push(req.files[i].originalname);
        }
        const imageOriginalName = JSON.stringify(imagesOriginalName);
        const postDate = new Date();
        const query = "INSERT INTO ProfessionalEdu (title, content, nickname, instructorName, category, eduPeriod, recruitNum, receptionPeriod, status, postDate, filename, fileOriginalName, price) values (?, ?, '관리자', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        const dbdata = [
            data.title,
            data.content,
            data.instructorName,
            data.category,
            data.eduPeriod,
            data.recruitNum,
            data.receptionPeriod,
            data.status,
            postDate,
            image,
            imageOriginalName,
            data.price
        ];
        db.query(query, dbdata, (err, result) => {
            if (err) return console.log(err);
            if (result) res.json({success: true});
        });
    },
    deleteFreePost: (req, res) => {
        const postID = req.params.postID;
        const query1 = "SELECT * FROM freeboard WHERE postID = ?";
        db.query(query1, [postID], (err, result) => {
            if (err) console.log(err);
            if (result) {
                const filename = JSON.parse(result[0].filename);
                const fileNum = filename.length;
                for (i=0; i<fileNum; i++) {
                    const key = filename[i];
                    deleteFileFromS3(key);
                }
                const query2 = "DELETE FROM freeboard WHERE postID = ?;";
                db.query(query2, [postID], (err, result) => {
                    if (err) return console.log(err);
                    if (result) res.json({success: true});
                });
            }
        }); 
    },
    FreeWrite: (req, res) => {
        const data = req.body;
        let images = [];
        for (let i=0; i < req.files.length; i++) {
            images.push(req.files[i].key.split('/').pop());
        }
        const image = JSON.stringify(images);
        let imagesOriginalName = [];
        for (let i=0; i < req.files.length; i++) {
            imagesOriginalName.push(req.files[i].originalname);
        }
        const imageOriginalName = JSON.stringify(imagesOriginalName);
        const postDate = new Date();
        const query = "INSERT INTO freeboard (title, content, nickname, postDate, filename, fileOriginalName) values (?, ?, '관리자', ?, ?, ?);";
        const dbdata = [
            data.title,
            data.content,
            postDate,
            image,
            imageOriginalName
        ];
        db.query(query, dbdata, (err, result) => {
            if (err) return console.log(err);
            if (result) res.json({success: true});
        });
    },
    deleteClubPost: (req, res) => {
        const postID = req.params.postID;
        const query1 = "SELECT * FROM clubboard WHERE postID = ?";
        db.query(query1, [postID], (err, result) => {
            if (err) console.log(err);
            if (result) {
                const filename = JSON.parse(result[0].filename);
                const fileNum = filename.length;
                for (i=0; i<fileNum; i++) {
                    const key = filename[i];
                    deleteFileFromS3(key);
                }
                const query2 = "DELETE FROM clubboard WHERE postID = ?;";
                db.query(query2, [postID], (err, result) => {
                    if (err) return console.log(err);
                    if (result) res.json({success: true});
                });
            }
        }); 
    },
    ClubWrite: (req, res) => {
        const data = req.body;
        let images = [];
        for (let i=0; i < req.files.length; i++) {
            images.push(req.files[i].key.split('/').pop());
        }
        const image = JSON.stringify(images);
        let imagesOriginalName = [];
        for (let i=0; i < req.files.length; i++) {
            imagesOriginalName.push(req.files[i].originalname);
        }
        const imageOriginalName = JSON.stringify(imagesOriginalName);
        const postDate = new Date();
        const query = "INSERT INTO clubboard (title, content, nickname, postDate, filename, fileOriginalName) values (?, ?, '관리자', ?, ?, ?);";
        const dbdata = [
            data.title,
            data.content,
            postDate,
            image,
            imageOriginalName
        ];
        db.query(query, dbdata, (err, result) => {
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