// 로그인 유무 판단

module.exports = {
    isLogined: function(req, res) {
        if (req.session.is_logined) {
            return true;
        } else {
            return false;
        }
    },

    status: function(req, res) {
        let authStatus = '로그인이 필요합니다.,login no';
        if (this.isLogined(req, res)) {
            authStatus = `${req.session.nickname},login ok`;
        }
        return authStatus;
    }   
}