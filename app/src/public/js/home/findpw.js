const id = document.querySelector('#id');
const name = document.querySelector('#name');
const mphone = document.querySelector('#mphone');

const findBtn = document.querySelector('#find');

findBtn.addEventListener("click", findPW);

function findPW() {
    if (!id.value) return alert("아이디를 입력해주세요.");
    if (!name.value) return alert("이름을 입력해주세요.");
    if (!mphone.value) return alert("전화번호를 입력해주세요.");

    const req = {
        id: id.value,
        name: name.value,
        mphone: mphone.value
    };

    fetch("/findpw", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req)
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.success) {
            location.href = `/findpw2?mphone=${encodeURIComponent(res.mphone)}`;
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("비밀번호 찾기 중 에러 발생");
    });
}