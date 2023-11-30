const express = require("express"); // express 새로 불러와줌
const router = express.Router();

const ctrl = require("./admin.ctrl");

router.get("/", ctrl.output.getAdmin);
router.get("/authcode", ctrl.output.getAuth); // 인증코드 발급하는 곳
router.get("/applylist", ctrl.output.getApplylist); // 교육신청 현황 보는 곳
router.get("/users", ctrl.output.getUsers); // 사용자 정보 보는 곳

module.exports = router;