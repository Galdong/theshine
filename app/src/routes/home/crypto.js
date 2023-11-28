// 비밀번호 해쉬하는 모듈 파일

const crypto = require('crypto');
const User = require("../../models/home/User");

const createSalt = () =>
    new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (err) reject(`${err}`);
            resolve(buf.toString('base64'));
        });
    });

const createHashedPassword = (plainPassword) =>
    new Promise(async (resolve, reject) => {
        const salt = await createSalt();
        crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
            if (err) reject(`${err}`);
            resolve({ password: key.toString('base64'), salt });
        });
    });

const makePasswordHashed = (id, password) =>
    new Promise(async (resolve, reject) => {
        const user = new User();
        const salt = JSON.parse(JSON.stringify(await user.getSalt(id))).salt;
        crypto.pbkdf2(password, salt, 9999, 64, 'sha512', (err, key) => {
            if (err) reject(err);
            resolve(key.toString('base64'));
        });
    });

module.exports = {
    createSalt,
    createHashedPassword,
    makePasswordHashed
};