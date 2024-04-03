"use strict";

const db = require('../../config/db');
const crypto = require("../../routes/home/crypto");

exports.getUserInfo = function(id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE id = ?;";
        db.query(query, [id], (err, data) => {
            if (err) reject(err); // 실패한경우 reject로 err를 던짐
            else resolve(data[0]); // 성공한경우 resolve를 던짐
            // data가 배열로 감싸져있어 그 중 RowDataPacket만 내보내기위해 인덱스[0]
        });           
    });  
}

exports.savec = async(userInfo) => { // 일반사용자 회원가입
    const users = await this.getUserInfo(userInfo.id);
    const { password, salt } = await crypto.createHashedPassword(userInfo.password);
    const date = new Date();
    if (users) { // 일치하는 값이 있으면
        return { success: false, msg: '이미 존재하는 아이디입니다.'};
    }
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO users (id, name, nickname, password, salt, address, mphone, category, joinDate, email) VALUES(?, ?, ?, ?, ?, ?, ?, 'user', ?, ?);";
        const dbdata = [
            userInfo.id, 
            userInfo.name, 
            userInfo.nickname,
            password,
            salt,
            userInfo.address, 
            userInfo.mphone, 
            date, 
            userInfo.email,
        ];
        db.query(query, dbdata, (err) => {
            if (err) reject(`${err}`);
            else resolve({ success: true });
        });           
    });
}

exports.getAuthcode = async (code) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM authcode WHERE code = ?;";
        db.query(query, [code], (err, data) => {
            if (err) reject(`${err}`);
            else resolve(data[0]);
        });
    });
}
exports.savep = async (userInfo) => { // 공급자 회원가입
    const users = await this.getUserInfo(userInfo.id);
    const { password, salt } = await crypto.createHashedPassword(userInfo.password);
    const date = new Date();
    if (users) { // 일치하는 값이 있으면
        return { success: false, msg: '이미 존재하는 아이디입니다.'};
    }
    return new Promise((resolve, reject) => {
        const query1 = "INSERT INTO users (id, name, nickname, password, salt, address, mphone, category, joinDate, email) VALUES(?, ?, ?, ?, ?, ?, ?, 'provider', ?, ?);";
        const dbdata = [
            userInfo.id, 
            userInfo.name, 
            userInfo.nickname, 
            password, 
            salt,
            userInfo.address, 
            userInfo.mphone, 
            date, 
            userInfo.email
        ];
        db.query(query1, dbdata, (err) => {
            if (err) reject(`${err}`);
            else resolve({ success: true });
        });
        const query2 = "DELETE FROM authcode WHERE code = ?;"
        // 사용된 인증코드 삭제
        db.query(query2, [userInfo.code], (err) => {
            if (err) reject(`${err}`);
            else resolve({ success: true });
        }); 
        const randomCode = Math.random().toString(36).substring(2, 10); //8자리 난수생성
        const query3 = "INSERT INTO authcode (code) values (?);"
        // 새로운 인증코드 추가
        db.query(query3, [randomCode], (err) => {
            if (err) reject(`${err}`);
            else resolve({ success: true });
        });       
    });
}

exports.getSalt = async (id) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT salt FROM users WHERE id = ?;";
        db.query(query, [id], (err, data) => {
            if (err) reject(err);
            else resolve(data[0]);
        });           
    });  
}

exports.generateRandom = function(min, max) {
    const randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randNum;
}

exports.emailSecurity = function (userEmail) {
    var id = userEmail.split('@')[0];
    var mail = userEmail.split('@')[1];
    var maskingId = function(id){
      var splitId = id.substring(0,3);
      for(var i = 1; i < id.length; i++){
          splitId += '*';
      }
      return splitId;
    };
    var maskingMail = function(mail){
      var splitMail = '';
      for(var i = 1; i < mail.length; i++){
          splitMail += '*';
      }
      splitMail += mail.substring(mail.length-1,mail.length);
      return splitMail;
    };
    userEmail = maskingId(id) + '@' + maskingMail(mail);
    return userEmail;
}