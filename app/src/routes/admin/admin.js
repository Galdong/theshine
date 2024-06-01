const express = require("express"); // express 새로 불러와줌
const router = express.Router();

const ctrl = require("./admin.ctrl");

router.get("/", ctrl.output.getAdmin);
router.get("/main", ctrl.output.getMain);
router.get("/authcode", ctrl.session.sessionExpiration, ctrl.output.getAuth); // 인증코드 발급하는 곳
router.get("/artapplylist", ctrl.session.sessionExpiration, ctrl.output.getArtApplylist); // 문화예술 교육신청 현황 보는 곳
router.get("/proapplylist", ctrl.session.sessionExpiration, ctrl.output.getProApplylist); // 전문 교육신청 현황 보는 곳
router.get("/users", ctrl.session.sessionExpiration, ctrl.output.getUsers); // 사용자 정보 보는 곳
router.get("/users/resetpwd/:id", ctrl.session.sessionExpiration, ctrl.output.getResetPwd); // 사용자 비밀번호 초기화

router.post("/users/resetpwd/:id", ctrl.process.ResetPwd);
router.post("/login", ctrl.process.adminLogin);
router.post("/artapplylist/change", ctrl.process.ArtChangeStatus); // 신청현황 변경
router.post("/proapplylist/change", ctrl.process.ProChangeStatus); // 신청현황 변경

module.exports = router;