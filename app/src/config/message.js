const axios = require('axios');
const CryptoJS = require('crypto-js');

const serviceID = process.env.NCP_SENS_SERVICE_ID;
const secretKey = process.env.NCP_SENS_SECRET_KEY;
const accessKey = process.env.NCP_SENS_ACCESS_KEY;
const fromPhoneNumber = process.env.NCP_SENS_FROM_PHONE_NUMBER;

const sendMessage = async (to, content) => {
    const date = Date.now().toString();
    const uri = `/sms/v2/services/${serviceID}/messages`;
    const url = `https://sens.apigw.ntruss.com${uri}`;

    const method = 'POST';
    const space = ' ';
    const newLine = '\n';
    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(uri);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(accessKey);

    const signature = hmac.finalize().toString(CryptoJS.enc.Base64);

    const body = {
        type: 'SMS',
        from: fromPhoneNumber,
        content,
        messages: [
            {
                to
            }
        ]
    };

    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'x-ncp-iam-access-key': accessKey,
        'x-ncp-apigw-timestamp': date,
        'x-ncp-apigw-signature-v2': signature
    };

    try {
        const response = await axios.post(url, body, { headers });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('메시지 전송에 실패했습니다.');
    }
};

module.exports = sendMessage;