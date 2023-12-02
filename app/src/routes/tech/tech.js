const express = require("express"); // express 새로 불러와줌
const router = express.Router();

const ctrl = require("./tech.ctrl");
const upload = require("../../config/multer");

router.get("/", ctrl.output.getTech);
router.get("/list/:page", ctrl.output.getList);
router.get("/write", ctrl.isLogined, ctrl.output.getWrite);
router.get("/list/:page/:boardno", ctrl.output.getView);
router.get("/edit/:boardno", ctrl.isLogined, ctrl.output.getEdit);
router.get("/apply/:boardno", ctrl.output.getApply);
router.get("/:category", ctrl.output.getCat);
router.get("/:category/:page", ctrl.output.getCatpage);
router.get("/:boardno", ctrl.output.getView2); // 관리자 페이지에서 게시글로 이동하기 위해 따로 구현

router.post("/write", upload.single('image'), ctrl.process.postWrite);
router.post("/edit/:boardno", upload.single('image'), ctrl.process.postEdit);
router.post("/delete/:boardno", ctrl.isLogined, ctrl.process.postDelete);
router.post("/apply/:boardno", ctrl.isLogined, ctrl.process.postApply);

module.exports = router;