"use strict";

const id = document.querySelector("#id"),
    name = document.querySelector("#name"),
    password = document.querySelector("#password"),
    confirmPassword = document.querySelector("#confirm-password"),
    address = document.querySelector('#address'),
    mphone = document.querySelector('#mphone'),
    nickname = document.querySelector('#nickname'),
    email = document.querySelector('#email'),
    code = document.querySelector("#code"),
    registerBtn = document.querySelector("#button"),
    submitPhoneBtn = document.querySelector('#submitPhone'),
    verificationSection = document.querySelector('#verificationSection'),
    submitCodeBtn = document.querySelector('#submitCode'),
    mphoneDisplay = document.querySelector('#mphone-display');

registerBtn.addEventListener("click", registerp);
submitPhoneBtn.addEventListener("click", submitPhone);
submitCodeBtn.addEventListener("click", submitCode);

let isVerified = false;

function registerp() {
    if (!id.value) return alert("아이디를 입력해주세요.");
    if (!name.value) return alert("이름을 입력해주세요.");
    if (!password.value || !confirmPassword.value) return alert("비밀번호를 입력해주세요.");
    if (!address.value) return alert("주소를 입력해주세요.");
    if (!mphone.value) return alert("전화번호를 입력해주세요.");
    if (!nickname.value) return alert("닉네임을 입력해주세요.");
    if (!email.value) return alert("이메일을 입력해주세요.");
    if (!code.value) return alert("인증코드를 입력해주세요.");
    if (password.value !== confirmPassword.value) {
        return alert("비밀번호가 일치하지 않습니다.");
    }

    const req = {
        id : id.value,
        name: name.value,
        password : password.value,
        address : address.value,
        mphone : mphone.value,
        nickname : nickname.value,
        email : email.value,
        code : code.value
    };
    
    if (!isVerified) {
        alert("전화번호 인증을 완료해주세요.");
        return false;
    }

    fetch("/registerp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // json타입인것을 명시
        },
        body: JSON.stringify(req) // req object파일을 문자열형태로 바꿔줌
    })  //fetch라는 것을 이용해 브라우저에 입력한 값을 서버에 전송
    .then((res) => res.json()) //서버로 부터 응답이 오면 json 메소드를 호출해서
                               //서버에 응답이 다 받아지는 순간 promise 객체 반환
    .then((res) => { // promise 객체 res에 접근
        if (res.success) {
            location.href = "/login"; // res.success = true이면 로그인페이지로이동
        } else {
            alert(res.msg); // false이면 메시지출력
        }
    })
    .catch((err) => { // 예외처리
        console.error("회원가입 중 에러 발생");
    });
       
}

function submitPhone() {
    const phoneNumber = mphone.value;
    if (!phoneNumber) {
        return alert("전화번호를 입력해주세요.");
    }
    fetch("/verify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ mphone : phoneNumber })
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.success) {
            verificationSection.style.display = 'block';
            mphoneDisplay.textContent = phoneNumber;
            startCountdown(300, document.querySelector('#countdown'));
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("전화번호 인증 중 오류 발생");
    })
}

function submitCode() {
    const verificationCode = document.querySelector('#verificationCode').value;
    
    fetch("/verifycode", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ verificationCode })
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.success) {
            alert("인증이 완료되었습니다.");
            hideVerificationElements();
            isVerified = true;
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("인증번호 확인 중 오류 발생:", err);
    });
}

function hideVerificationElements() {
    submitPhoneBtn.style.display = 'none';
    verificationSection.style.display = 'none';
}

function startCountdown(duration, display) {
    let timer = duration, minutes, seconds;
    const interval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(interval);
            display.textContent = "00:00";
            alert("인증 시간이 만료되었습니다.");
        }
    }, 1000);
}

window.onload = function () {
    const fiveMinutes = 60 * 5,
        display = document.querySelector('#countdown');
    startCountdown(fiveMinutes, display);
};