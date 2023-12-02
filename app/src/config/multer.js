const multer = require("multer");
const uuid4 = require("uuid4"); // 랜덤한값 생성해주는 모듈
const path = require("path");

const upload = multer({
    storage: multer.diskStorage({
        filename(req, file, done) {
            const randomID = uuid4();
            const ext = path.extname(file.originalname); // path모듈을 통해 확장자 추출
            const filename = randomID + ext;
            done(null, filename);
        },
        destination(req, file, done) {
            done(null, path.join(__dirname, "../public/images"));
        },
    })
});

module.exports = upload;