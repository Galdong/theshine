const express = require("express"); // express 새로 불러와줌
const router = express.Router();

const ctrl = require("./job.ctrl");
const upload = require("../../config/multer");

router.get("/", ctrl.output.getJob);
router.get("/list/:page", ctrl.output.getList);
router.get("/write", ctrl.isLogined, ctrl.output.getWrite);
router.get("/list/:page/:boardno", ctrl.output.getView);
router.get("/edit/:boardno", ctrl.isLogined, ctrl.output.getEdit);

router.post("/write", upload.single('image'), ctrl.process.postWrite);
router.post("/edit/:boardno", upload.single('image'), ctrl.process.postEdit);
router.post("/delete/:boardno", ctrl.process.postDelete);
module.exports = router;