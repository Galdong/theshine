const db = require('../../config/db');
const Free = require("../../models/free/Free");
const fs = require('fs');
const path = require('path');

const output = {
    getFree: (req, res) => {
        const query = "SELECT * FROM freeboard ORDER BY postID DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("free/freeList", {
                'data':result,
                'length':result.length - 1,
                'page': 1,
                'page_num': 10,
            });
        });

    },
    getList: (req, res) => {
        const page = parseInt(req.params.page);
        const query = "SELECT * FROM freeboard ORDER BY postID DESC";
        db.query(query, (err, result) => {
            if (err) console.log(err);
            if (result) res.render("free/freeList", {
                'data':result,
                'length':result.length - 1,
                'page': page,
                'page_num': 10,
            });
        });
    },
    getView: (req, res) => {
        const postID = req.params.postID;
        if (isNaN(postID)) {
            parseInt(postID);
        } else {
            const query = "SELECT * FROM freeboard where postID = ?";
            db.query(query, [postID], (err, result) => {
                if (err) console.log(err);
                if (result) {
                    let data = {
                        'data':result,
                        'imageNum':JSON.parse(result[0].filename).length,
                        'image':JSON.parse(result[0].filename)
                    };
                    const query2 = "SELECT * FROM freeboardComment where postID = ?";
                    db.query(query2, [postID], (err, result2) => {
                        if (err) console.log(err);
                        if (result2) {
                            data.comment = result2,
                            data.commentNum = result2.length
                            res.render("free/freeView", data);
                        }
                    });
                }
            });
        };     
    },
    getWrite: (req, res) => {
        const nickname = req.session.nickname;
        res.render("free/freeWrite", {'nickname':nickname});
    },
    getEdit: (req, res) => {
        const postID = parseInt(req.params.postID);
        const nickname = req.session.nickname;
        const query = "SELECT * FROM freeboard where postID = ?";
        db.query(query, [postID], (err, result) => {
            if (err) console.log(err);
            if (result) {
                if (result[0].nickname !== nickname) {
                    res.send("<script>alert('본인이 작성한 글만 수정할 수 있습니다.');location.href=history.back();</script>");
                } else {
                    res.render("free/freeEdit", {
                        'data':result, 
                        'nickname':nickname,
                        'imageNum':JSON.parse(result[0].filename).length,
                        'imageOriginalName':JSON.parse(result[0].fileOriginalName)
                    });
                }
            }
        });    
    },
}

const process = {
    postWrite: async (req, res) => {
        const nickname = req.session.nickname;
        let images = [];
        for (var i=0; i < req.files.length; i++) {
            images.push(req.files[i].filename);
        }
        const image = JSON.stringify(images);
        let imagesOriginalName = [];
        for (var i=0; i < req.files.length; i++) {
            imagesOriginalName.push(req.files[i].originalname);
        }
        const imageOriginalName = JSON.stringify(imagesOriginalName);
        const free = new Free(req.body);
        const response = await free.post(nickname, image, imageOriginalName);
        return res.json(response);
    },
    postEdit: async (req, res) => {
        const postID = req.params.postID;
        if (req.files) {
            var images =[];
            var imagesOriginalName = [];
            for (var i=0; i < req.files.length; i++) {
                images.push(req.files[i].filename);
            }
            for (var j=0; j < req.files.length; j++) {
                imagesOriginalName.push(req.files[j].originalname);
            }
        }
        const data = req.body;
        if (isNaN(postID)) {
            parseInt(postID);
        } else {
            const query1 = "SELECT * FROM freeboard WHERE postID = ?";
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
                        const filepath = path.join(__dirname, "../../public/images/");

                        const filesToDelete = fileOriginalName1.filter(name => deletedFile.includes(name));
                        
                        filesToDelete.forEach(name => {
                            const index = fileOriginalName1.indexOf(name);
                            if (index !== -1) {
                                const fullFilepath = path.join(filepath, filename1[index]);
                                fs.unlink(fullFilepath, (err) => {
                                    if (err) {
                                        console.error('file');
                                        return;
                                    }
                                });
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
                    const query2 = "UPDATE freeboard SET title=?, content=?, updateDate=?, filename=?, fileOriginalName=? WHERE postID=?;";
                    const dbdata = [
                        data.title,
                        data.content,
                        updatedate,
                        newFilename,
                        newFileOriginalName,
                        postID
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
        const query1 = "SELECT * FROM freeboard where postID = ?";
        db.query(query1, [postID], (err, result) => {
            if (err) console.log(err);
            if (result) {
                if (result[0].nickname !== nickname) {
                    res.json({ success: false, msg: "본인이 작성한 글만 삭제할 수 있습니다." });
                } else {
                    const filename = JSON.parse(result[0].filename);
                    const fileNum = filename.length;
                    const filepath = path.join(__dirname, "../../public/images/");
                    for (i=0; i<fileNum; i++) {
                        const fullFilepath = path.join(filepath, filename[i]);
                        fs.unlink(fullFilepath, (err) => {
                            if (err) {
                                console.error(err);
                                return
                            }
                        });
                    }
                    const query2 = "DELETE FROM freeboard WHERE postID = ?;";
                    db.query(query2, [postID], (err, result) => {
                        if (err) return console.log(err);
                        if (result) res.json({success: true});
                    });
                }
            }
        }); 
    },
    commentWrite: (req, res) => {
        const postID = parseInt(req.params.postID);
        const nickname = req.session.nickname;
        const content = req.body.content;
        const postdate = new Date();
        const query = "INSERT INTO freeboardComment (postID, nickname, content, postDate) values (?, ?, ?, ?);";
        const dbdata = [
            postID,
            nickname,
            content,
            postdate
        ];
        db.query(query, dbdata, (err, result) => {
            if (err) console.log(err);
            if (result) res.json({success: true});
        });
    },
    commentDelete: (req, res) => {
        const commentID = parseInt(req.params.commentID);
        const nickname = req.session.nickname;
        const query1 = "SELECT * FROM freeboardComment WHERE commentID=?";
        db.query(query1, [commentID], (err, result) => {
            if (err) console.log(err);
            if (result) {
                if (result[0].nickname !== nickname) {
                    res.json({ success: false, msg: "본인이 작성한 글만 삭제할 수 있습니다." });
                } else {
                    const query2 = "DELETE FROM freeboardComment WHERE commentID=?";
                    db.query(query2, [commentID], (err, result) => {
                        if (err) return console.log(err);
                        if (result) res.json({success: true});
                    });
                }
            }
        });
    },
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