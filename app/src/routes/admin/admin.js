const express = require("express"); // express 새로 불러와줌
const router = express.Router();

const ctrl = require("./admin.ctrl");
const upload = require("../../config/multer");

router.get("/", ctrl.output.getAdmin);
router.get("/main", ctrl.session.sessionExpiration, ctrl.output.getMain);
router.get("/authcode", ctrl.session.sessionExpiration, ctrl.output.getAuth); // 인증코드 발급하는 곳
router.get("/artapplylist", ctrl.session.sessionExpiration, ctrl.output.getArtApplylist); // 문화예술 교육신청 현황 보는 곳
router.get("/proapplylist", ctrl.session.sessionExpiration, ctrl.output.getProApplylist); // 전문 교육신청 현황 보는 곳
router.get("/users", ctrl.session.sessionExpiration, ctrl.output.getUsers); // 회원 정보 보는 곳
router.get("/instructors", ctrl.session.sessionExpiration, ctrl.output.getInstructors);
router.get("/message",ctrl.session.sessionExpiration, ctrl.output.getMessage); // 단체 문자 발송
router.get("/logout", ctrl.process.logout);
router.get("/artlist", ctrl.session.sessionExpiration, ctrl.output.getArtlist);
router.get("/prolist", ctrl.session.sessionExpiration, ctrl.output.getProlist);
router.get("/artview/:postID", ctrl.session.sessionExpiration, ctrl.output.getArtview);
router.get("/proview/:postID", ctrl.session.sessionExpiration, ctrl.output.getProview);
router.get("/art/write", ctrl.session.sessionExpiration, ctrl.output.getArtWrite);

router.post("/login", ctrl.process.adminLogin);
router.post("/users/resetpwd", ctrl.session.sessionExpiration, ctrl.process.ResetPwd); // 비밀번호 초기화
router.post("/artapplylist/change", ctrl.session.sessionExpiration, ctrl.process.ArtChangeStatus); // 신청현황 변경
router.post("/proapplylist/change", ctrl.session.sessionExpiration, ctrl.process.ProChangeStatus); // 신청현황 변경
router.post("/artapplylist/delete", ctrl.session.sessionExpiration, ctrl.process.deleteArtApply); // 신청내역 삭제
router.post("/proapplylist/delete", ctrl.session.sessionExpiration, ctrl.process.deleteProApply);
router.post("/artview/delete/:postID", ctrl.session.sessionExpiration, ctrl.process.deleteArtPost);
router.post("/proview/delete/:postID", ctrl.session.sessionExpiration, ctrl.process.deleteProPost);
router.post("/art/write", ctrl.session.sessionExpiration, upload.array('image', 5), ctrl.process.ArtWrite);

module.exports = router;