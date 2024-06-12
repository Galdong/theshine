const db = require('../../config/db');
const Art = require("../../models/art/Art");
const { deleteFileFromS3 } = require('../../config/multer');
const sendMessage = require('../../config/message');

const output = {
    getArt: (req, res) => {
        const query = "SELECT * FROM CulturalArtEdu ORDER BY postID DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("art/artMain", {
                'data':result,
                'length':result.length - 1,
                'page': 1,
                'page_num': 10,
            });
        });
    },
    getList: (req, res) => {
        const page = parseInt(req.params.page);
        const query = "SELECT * FROM CulturalArtEdu ORDER BY postID DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("art/artMain", {
                'data':result,
                'length':result.length - 1,
                'page': page,
                'page_num': 10,
            });
        });
    },
    getCat: (req, res) => {
        const category = req.params.category;
        const query = "SELECT * FROM CulturalArtEdu WHERE category = ? ORDER BY postID DESC";
        db.query(query, [category], (err, result) => {
            if (err) console.log(err);
            if (result) res.render("art/artList", {
                'data':result,
                'length':result.length - 1,
                'page': 1,
                'page_num': 10,
                'category': category,
            });
        });
    },
    getCatpage: (req, res) => {
        const category = req.params.category;
        const page = parseInt(req.params.page);
        const query = "SELECT * FROM CulturalArtEdu WHERE category = ? ORDER BY postID DESC";
        db.query(query, [category], (err, result) => {
            if (err) console.log(err);
            if (result) res.render("art/artList", {
                'data':result,
                'length':result.length - 1,
                'page': page,
                'page_num': 10,
                'category': category,
            });
        });
    },
    getView: (req, res) => {
        const postID = req.params.postID;
        if (isNaN(postID)) {
            parseInt(postID);
        } else {
            const query = "SELECT * FROM CulturalArtEdu where postID = ?";
            db.query(query, [postID], (err, result) => {
                if (err) console.log(err);
                if (result) res.render("art/artView", {
                    'data':result,
                    'imageNum':JSON.parse(result[0].filename).length,
                    'image':JSON.parse(result[0].filename)
                });
            });
        }   
    },
    getWrite: (req, res) => {
        const nickname = req.session.nickname;
        res.render("art/artWrite", {'nickname':nickname});
    },
    getEdit: (req, res) => {
        const postID = parseInt(req.params.postID);
        const nickname = req.session.nickname;
        const query = "SELECT * FROM CulturalArtEdu where postID = ?";
        db.query(query, [postID], (err, result) => {
            if (err) console.log(err);
            if (result) {
                if (result[0].nickname !== nickname) {
                    res.send("<script>alert('본인이 작성한 글만 수정할 수 있습니다.');location.href=history.back();</script>");
                } else {
                    res.render("art/artEdit", {
                        'data':result, 
                        'nickname':nickname,
                        'imageNum':JSON.parse(result[0].filename).length,
                        'imageOriginalName':JSON.parse(result[0].fileOriginalName)
                    });
                }
            }
        });    
    },
    getApply: (req, res) => {
        res.send("<script>alert('신청이 완료되었습니다.');location.href='/art';</script>");
    },
    getView2: (req, res) => {
        const postID = req.params.postID;
        if (isNaN(postID)) {
            parseInt(postID);
        } else {
            const query = "SELECT * FROM CulturalArtEdu where postID = ?";
            db.query(query, [postID], (err, result) => {
                if (err) console.log(err);
                if (result) res.render("art/artView", {'data':result});
            });
        }   
    },
}

const process = {
    postWrite: async (req, res) => {
        const nickname = req.session.nickname;
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
        const art = new Art(req.body);
        const response = await art.post(nickname, image, imageOriginalName);
        return res.json(response);
    },
    postEdit: async (req, res) => {
        const postID = req.params.postID;
        if (req.files) {
            var images =[];
            var imagesOriginalName = [];
            for (var i=0; i < req.files.length; i++) {
                images.push(req.files[i].key.split('/').pop());
            }
            for (var j=0; j < req.files.length; j++) {
                imagesOriginalName.push(req.files[j].originalname);
            }
        }
        const data = req.body;
        if (isNaN(postID)) {
            parseInt(postID);
        } else {
            const query1 = "SELECT * FROM CulturalArtEdu WHERE postID = ?";
            db.query(query1, postID, (err, result) => {
                if (err) console.log(err);
                if (result) {
                    if (data.deletedImage) {
                        let filename1 = JSON.parse(result[0].filename);
                        let fileOriginalName1 = JSON.parse(result[0].fileOriginalName);
                        let deletedFile = data.deletedImage;
                        if (!Array.isArray(deletedFile)) {
                            deletedFile = deletedFile.split();
                        }

                        const filesToDelete = fileOriginalName1.filter(name => deletedFile.includes(name));
                        
                        filesToDelete.forEach(async (name) => {
                            const index = fileOriginalName1.indexOf(name);
                            if (index !== -1) {
                                const key = filename1[index];
                                await deleteFileFromS3(key);
                            }
                        });

                        filename1 = filename1.filter((_, index) => !filesToDelete.includes(fileOriginalName1[index]));
                        fileOriginalName1 = fileOriginalName1.filter(name => !deletedFile.includes(name));
                        if (req.files) {
                            filename1.push(...images);
                            fileOriginalName1.push(...imagesOriginalName);
                            var newFilename = JSON.stringify(filename1);
                            var newFileOriginalName = JSON.stringify(fileOriginalName1);
                        } else {
                            var newFilename = JSON.stringify(filename1);
                            var newFileOriginalName = JSON.stringify(fileOriginalName1);
                        }
                    } else {
                        let filename2 = JSON.parse(result[0].filename);
                        let fileOriginalName2 = JSON.parse(result[0].fileOriginalName);
                        if (req.files) {
                            filename2.push(...images);
                            fileOriginalName2.push(...imagesOriginalName);
                            var newFilename = JSON.stringify(filename2); 
                            var newFileOriginalName = JSON.stringify(fileOriginalName2);
                        } else {
                            var newFilename = JSON.stringify(filename2);
                            var newFileOriginalName = JSON.stringify(fileOriginalName2);
                        }
                    }
                    const updatedate = new Date();
                    const query2 = "UPDATE CulturalArtEdu SET title=?, content=?, instructorName=?, category=?, eduPeriod=?, recruitNum=?, receptionPeriod=?, place=?, status=?, updateDate=?, filename=?, fileOriginalName=? WHERE postID=?;";
                    const dbdata = [
                        data.title,
                        data.content,
                        data.instructorName,
                        data.category,
                        data.eduPeriod,
                        data.recruitNum,
                        data.receptionPeriod,
                        data.place,
                        data.status,
                        updatedate,
                        newFilename,
                        newFileOriginalName,
                        postID,
                    ];
                    db.query(query2, dbdata, (err, result) => {
                        if (err) console.log(err);
                        if (result) res.json({success: true});
                    }); 
                }   
            });
        }
    },
    postDelete: (req, res) => {
        const postID = parseInt(req.params.postID);
        const nickname = req.session.nickname;
        const query1 = "SELECT * FROM CulturalArtEdu where postID = ?";
        db.query(query1, [postID], (err, result) => {
            if (err) console.log(err);
            if (result) {
                if (result[0].nickname !== nickname) {
                    res.send("<script>alert('본인이 작성한 글만 삭제할 수 있습니다.');location.href=history.back();</script>");
                } else {
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
            }
        }); 
    },
    postApply: (req, res) => {
        const postID = parseInt(req.params.postID);
        const nickname = req.session.nickname;
        const query = "SELECT CulturalArtEdu.postID, CulturalArtEdu.title, CulturalArtEdu.category, CulturalArtEdu.status, CulturalArtEdu.price, users.id, users.name, users.nickname, users.mphone FROM CulturalArtEdu INNER JOIN users ON users.nickname = ? WHERE postID = ?;";
        const applydate = new Date();
        db.query(query, [nickname, postID], (err, result) => {
            if (err) console.log(err);
            if (result) {
                const query2 = "INSERT INTO artapply (postID, title, category, recruitStatus, price, id, name, nickname, mphone, applydate, applyStatus) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'wait');";
                dbdata = [
                    postID,
                    result[0].title,
                    result[0].category,
                    result[0].status,
                    result[0].price,
                    result[0].id,
                    result[0].name,
                    result[0].nickname,
                    result[0].mphone,
                    applydate
                ];
                db.query(query2, dbdata, (err, data) => {
                    if (err) console.log(err);
                    if (data) res.json({success: true});
                });
                async function sendMessages(to, content1, content2) {
                    try {
                        await sendMessage(to, content1);
                        await sendMessage(to, content2);
                    } catch (error) {
                        console.error('메시지 전송 실패');
                    }
                }
                applydate.setDate(applydate.getDate() + 7);
                const month = String(applydate.getMonth() + 1).padStart(2, '0');
                const day = String(applydate.getDate()).padStart(2, '0');
                const paymentDate = `${month}-${day}`;
                const price = result[0].price.toLocaleString('en-US');
                const to = result[0].mphone;
                const content1 = `[챌린지 플러스] ${result[0].name} 님의 교육 신청이 완료되었습니다.`
                const content2 = `농협 12342183213451 (갈동현)으로 ${paymentDate}까지 ${price}원 입금부탁드립니다.`
                sendMessages(to, content1, content2);
            }
        });
    }
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
