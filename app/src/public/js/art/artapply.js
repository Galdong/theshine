const select = (selector) => document.querySelector(selector);

const applyBtn = select('#abutton');
const deleteBtn = select('#dbutton');

applyBtn.addEventListener("click", apply);
deleteBtn.addEventListener("click", deleteform);

const postID = window.location.href.split('/')[6];

function apply() {
    const req = {};
    const url = `/art/apply/${postID}`;
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
            location.href = "/art";
        } else {
            alert(res.msg);
            location.href = "/art/:postID";
        }
    })
    .catch((err) => { // 예외처리
        console.error("신청 중 에러 발생");
    });      
}
function deleteform() {
    const req = {};
    const url = `/art/delete/${postID}`;
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
            location.href = "/art";
        } else {
            alert(res.msg);
            location.href = "/art/:postID";
        }
    })
    .catch((err) => { // 예외처리
        console.error("글 삭제 중 에러 발생");
    });      
}