const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const uuid4 = require("uuid4"); // 랜덤한값 생성해주는 모듈
const path = require("path");

const s3Client = new S3Client({
    region: 'ap-northeast-2',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
});

const storage = multerS3({
    s3: s3Client,
    bucket: process.env.S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function(req, file, cb) {
        file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8"); // 원본파일명 한글깨짐 해결
        const randomID = uuid4();
        const ext = path.extname(file.originalname);
        const filename = randomID + ext;
        cb(null, "images/" + filename);
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

const deleteFileFromS3 = async(key) => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: "challengeplus-images",
            Key: "images/" + key,
        });
        await s3Client.send(command);
    } catch(error) {
        console.error(error);
        throw error;
    }
};

const upload = multer({
    storage: storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 파일 사이즈 5MB 제한
    },
});

module.exports = upload;
module.exports.deleteFileFromS3 = deleteFileFromS3;
