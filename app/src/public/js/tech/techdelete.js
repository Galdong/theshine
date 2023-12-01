const select = (selector) => document.querySelector(selector);

const yesbutton = select('#yesbutton');
const nobutton = select('#nobutton');

yesbutton.addEventListener("click", deleteform);
nobutton.addEventListener("click", goback);

function goback() {
    history.go(-1);
}

function deleteform() {
    const req = {};
    const url = window.location.href;
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
            location.href = "/tech";
        } else {
            alert(res.msg);
            location.href = "/tech/:boardno";
        }
    })
    .catch((err) => { // 예외처리
        console.error("글 삭제 중 에러 발생");
    });      
}
