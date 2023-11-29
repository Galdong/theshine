const express = require("express"); // express 새로 불러와줌
const router = express.Router();

const ctrl = require("./edu.ctrl");

router.get("/", ctrl.output.getEdu);
router.get("/list/:page", ctrl.output.getList);
router.get("/write", ctrl.isLogined, ctrl.output.getWrite);
router.get("/list/:page/:boardno", ctrl.output.getView);
router.get("/edit/:boardno", ctrl.isLogined, ctrl.output.getEdit);
router.get("/delete/:boardno", ctrl.isLogined, ctrl.output.getDelete);
router.get("/apply/:boardno", ctrl.output.getApply);

router.post("/write", ctrl.process.postWrite);
router.post("/edit/:boardno", ctrl.process.postEdit);
router.post("/delete/:boardno", ctrl.process.postDelete);
router.post("/apply/:boardno", ctrl.process.postApply);

module.exports = router;