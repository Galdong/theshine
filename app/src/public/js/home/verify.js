const submitCodeBtn = document.querySelector('#submitCode');

submitCodeBtn.addEventListener("click", submitCode);

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
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("인증번호 확인 중 오류 발생:", err);
    });
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
            // 추가적으로 만료 시 처리 로직 추가 가능
        }
    }, 1000);
}

// 5분(300초) 카운트다운 시작
window.onload = function () {
    const fiveMinutes = 60 * 5,
        display = document.querySelector('#countdown');
    startCountdown(fiveMinutes, display);
};