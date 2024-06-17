const name = document.querySelector('#name');
const mphone = document.querySelector('#mphone');

const findBtn = document.querySelector('#find');

findBtn.addEventListener("click", findID);

function findID() {
    if (!name.value) return alert("이름을 입력해주세요.");
    if (!mphone.value) return alert("전화번호를 입력해주세요.");

    const req = {
        name: name.value,
        mphone: mphone.value
    };

    fetch("/findid", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req)
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.success) {
            location.href = `/findid2?mphone=${encodeURIComponent(res.mphone)}`;
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("아이디 찾기 중 에러 발생");
    });
}