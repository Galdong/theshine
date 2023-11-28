"use strict";

const UserStorage = require("./UserStorage");
const db = require("../../config/db");
 
class User { // UserStorage 데이터를 가지고 검증 및 조작하는 역할
    constructor(body) {
        this.body = body;
    }

    async login() {
        try {
            const client = this.body;
            const user = await UserStorage.getUserInfo(client.id);
            // getUserInfo가 다 실행되기 전에 실행되지 말라고 비동기처리 await
            // await을 호출하기 위해 login에 async 붙이기
            if (user) {
                if (user.id === client.id && user.password === client.password) {
                    return { success : true };
                }
                return { success : false, msg: "비밀번호가 틀렸습니다."};
            }
            return { success : false, msg: "존재하지 않는 아이디입니다."}; 
        } catch (err) {
            return { success: false, msg: err };
        }
        
    }

    async registerc() {
        const client = this.body;
        try {
            const response = await UserStorage.savec(client);
            return response;
        } catch (err) {
            return { success: false, msg: err };
        }
    }
    

    async registerp() {
        const client = this.body;
        try {
            const user = await UserStorage.getAuthcode(client.code);
            if (user.code === client.code) {
                const response = await UserStorage.savep(client);
                return response;
            }
        } catch (err) {
            return { success: false, msg: '인증코드가 틀립니다.' };
        }
    }

    getSalt(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT salt FROM users WHERE id = ?;";
            db.query(query, [id], (err, data) => {
                if (err) reject(err); // 실패한경우 reject로 err를 던짐
                else resolve(data[0]); // 성공한경우 resolve를 던짐
                // data가 배열로 감싸져있어 그 중 RowDataPacket만 내보내기위해 인덱스[0]
            });           
        });  
    }
}

module.exports = User;