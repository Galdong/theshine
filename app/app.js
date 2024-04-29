"use strict";

// 모듈
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const DBoptions = {
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};
 
const sessionStore = new MySQLStore(DBoptions);
const options = {
    secret: process.env.SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false
};
 
app.use(session(options));

// 라우팅
const home = require("./src/routes/home");
const jobRouter = require("./src/routes/job/job");
const clubRouter = require("./src/routes/club/club");
const artRouter = require("./src/routes/art/art");
const proRouter = require("./src/routes/pro/pro");
const adminRouter = require("./src/routes/admin/admin");
const freeRouter = require("./src/routes/free/free");
const picnicRouter = require("./src/routes/picnic/picnic");

app.set("views","./src/views");
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/src/public`));
//__dirname은 현재 문서(app.js)가 있는 위치를 반환
// 위 경로를 정적 경로로 추가
app.use(bodyParser.json()); //bodyParser가 json 데이터를 파싱해올수 있도록
app.use(bodyParser.urlencoded({ extended: true }));
/* URL을 통해 전달되는 데이터에 한글, 공백 등과 같은 문자가 포함될 경우
   제대로 인식되지 않는 문제 해결 */
app.use("/", home); // use -> 미들웨어 등록해주는 메소드
app.use("/job", jobRouter); // 일자리 정보 게시판 라우팅등록
app.use("/club", clubRouter); // 동호회 게시판 라우팅등록
app.use("/art", artRouter); // 문화예술교육 게시판 라우팅등록
app.use("/pro", proRouter); // 전문교육 게시판 라우팅등록
app.use("/admin", adminRouter); // 관리자게시판 라우팅등록
app.use("/free", freeRouter); // 자유게시판 라우팅등록
app.use("/picnic", picnicRouter); // 나들이 정보 게시판 라우팅등록

module.exports = app; // bin/www.js 에 내보내주려고
