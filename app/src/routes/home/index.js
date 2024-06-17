"use strict";

const express = require("express"); // express 새로 불러와줌
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/", ctrl.output.home); // 컨트롤러 부분을 모듈화 한것
router.get("/login", ctrl.output.login);
router.get("/logout", ctrl.output.logout);
router.get("/registerc", ctrl.output.registerc);
router.get("/registerp", ctrl.output.registerp);
router.get("/registercat", ctrl.output.registercat);
router.get("/verify", ctrl.output.getVerify);
router.get("/findid", ctrl.output.getFindID);
router.get("/findid2", ctrl.output.getFindID2);
router.get("/findid3", ctrl.output.getFindID3);
router.get("/findpw", ctrl.output.getFindPW);
router.get("/findpw2", ctrl.output.getFindPW2);
router.get("/resetpw", ctrl.output.getResetPW);

router.post("/login", ctrl.process.login);
router.post("/registerc", ctrl.process.registerc);
router.post("/registerp", ctrl.process.registerp);
router.post("/verify", ctrl.process.verify);
router.post("/verifycode", ctrl.process.verifycode);
router.post("/findid", ctrl.process.findID)
router.post("/findid2", ctrl.process.findID2);
router.post("/findpw", ctrl.process.findPW);
router.post("/findpw2", ctrl.process.findPW2);
router.post("/resetpw", ctrl.process.resetPW);

module.exports = router; // router를 외부파일에서 사용할 수 있도록 함.