const verifyBtn = document.querySelector('#verify');
const countdown = document.querySelector('#countdown');

verifyBtn.addEventListener("click", verify);

function verify() {
    const verificationCode = document.querySelector('#verificationCode').value;

    fetch("/findid2", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ verificationCode })
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.success) {
            alert("인증 완료되었습니다.");
            location.href = "/findid3";
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("인증번호 확인 중 오류 발생:", err);
    });
}

window.onload = function () {
    const fiveMinutes = 60 * 5;
    startCountdown(fiveMinutes, countdown);
};

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