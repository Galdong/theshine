const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const smtpTransport = nodemailer.createTransport({
    pool : true,
    maxConnections : 1,
    service : "naver",
    host : "smtp.naver.com",
    port : 465,
    secure : false,
    requireTLS : true,
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
    },
    tls : {
        rejectUnauthorized : false
    }
});

module.exports = smtpTransport;