const select = (selector) => document.querySelector(selector);

const registerBtn = select('#button');

registerBtn.addEventListener("click", apply);
const boardno = window.location.href.split('/')[6];

function apply() {
    const req = {};
    const url = `/arte/apply/${boardno}`;
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(req) 
    }) 
    .then((res) => res.json()) 
    .then((res) => { 
        if (res.success) {
            location.href = "/arte";
        } else {
            alert(res.msg);
            location.href = "/arte/:boardno";
        }
    })
    .catch((err) => { // 예외처리
        console.error("글 삭제 중 에러 발생");
    });      
}