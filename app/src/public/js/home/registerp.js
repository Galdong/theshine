"use strict";

const id = document.querySelector("#id"),
    name = document.querySelector("#name"),
    password = document.querySelector("#password"),
    confirmPassword = document.querySelector("#confirm-password"),
    nickname = document.querySelector('#nickname'),
    email = document.querySelector('#email'),
    code = document.querySelector("#code"),
    registerBtn = document.querySelector("#button");

registerBtn.addEventListener("click", registerp);

function registerp() {
    if (!id.value) return alert("아이디를 입력해주세요.");
    if (!name.value) return alert("이름을 입력해주세요.");
    if (!password.value || !confirmPassword.value) return alert("비밀번호를 입력해주세요.");
    if (!code.value) return alert("인증코드를 입력해주세요.");
    if (!nickname.value) return alert("닉네임을 입력해주세요.");
    if (!email.value) return alert("이메일을 입력해주세요.");
    if (password.value !== confirmPassword.value) {
        return alert("비밀번호가 일치하지 않습니다.");
    }

    const req = {
        id : id.value,
        name: name.value,
        password : password.value,
        code : code.value,
        nickname : nickname.value,
        email : email.value
    };
    
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