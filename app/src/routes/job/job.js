const express = require("express"); // express 새로 불러와줌
const router = express.Router();

const ctrl = require("./job.ctrl");

router.get("/", ctrl.output.getList);
router.get("/write", ctrl.output.getWrite);
router.get("/:boardno", ctrl.output.getView);
router.get("/edit/:boardno", ctrl.isLogined, ctrl.output.getEdit);
router.get("/delete/:boardno", ctrl.output.getDelete);

router.post("/write", ctrl.process.postWrite);
router.post("/edit/:boardno", ctrl.process.postEdit);
router.post("/delete/:boardno", ctrl.process.postDelete);
module.exports = router;