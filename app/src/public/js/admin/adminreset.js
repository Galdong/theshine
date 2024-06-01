const yesbutton = document.querySelector('#yes');
const nobutton = document.querySelector('#no');

yesbutton.addEventListener("click", () => {
    reset();
});

nobutton.addEventListener("click", () => {
    window.location.href="/admin/users";
});

function reset() {
    const url = window.location.href;
    fetch(url, {
        method: "POST",
    })
    .then((res)=>res.json())
    .then((res) => {
        if (res.success) {
            location.href = "/admin/users";
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("비밀번호 초기화 중 오류 발생");
    });
}