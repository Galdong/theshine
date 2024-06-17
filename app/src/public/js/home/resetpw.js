const resetBtn = document.querySelector('#reset');

resetBtn.addEventListener("click", reset);

function reset() {
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirm-password").value;
    if (!password || !confirmPassword) return alert("비밀번호를 입력해주세요.");
    if (password !== confirmPassword) return alert("비밀번호가 일치하지 않습니다.");

    fetch("/resetpw", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.success) {
            alert("비밀번호가 변경되었습니다.");
            location.href = "/login";
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("비밀번호 재설정 중 오류 발생:", err);
    });
}