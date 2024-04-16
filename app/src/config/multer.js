const multer = require("multer");
const uuid4 = require("uuid4"); // 랜덤한값 생성해주는 모듈
const path = require("path");

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8"); // 원본파일명 한글깨짐 해결
        const randomID = uuid4();
        const ext = path.extname(file.originalname); // path모듈을 통해 확장자 추출
        const filename = randomID + ext;
        cb(null, filename);
    },
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images"));
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(null, false, new Error('이미지 파일 형식만 가능합니다.'));
    }
    else {
        cb(null, true);
    }
};

const upload = multer({
    storage: storage,
    fileFilter,
    limits: {
        fileSize: 1000000, // 파일 사이즈 10MB 제한
    },
});

module.exports = upload;