const express = require("express"); // express 새로 불러와줌
const router = express.Router();

const ctrl = require("./picnic.ctrl");
const upload = require("../../config/multer");

router.get("/", ctrl.output.getPicnic);
router.get("/list/:page", ctrl.output.getList);
router.get("/write", ctrl.isLogined, ctrl.output.getWrite);
router.get("/list/:page/:postID", ctrl.output.getView);
router.get("/edit/:postID", ctrl.isLogined, ctrl.output.getEdit);

router.post("/write", upload.array('image', 5), ctrl.process.postWrite);
router.post("/edit/:postID", upload.array('image', 5), ctrl.process.postEdit);
router.post("/delete/:postID", ctrl.process.postDelete);
module.exports = router;