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

router.post("/login", ctrl.process.login);
router.post("/registerc", ctrl.process.registerc);
router.post("/registerp", ctrl.process.registerp);

module.exports = router; // router를 외부파일에서 사용할 수 있도록 함.