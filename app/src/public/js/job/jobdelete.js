const select = (selector) => document.querySelector(selector);

const deleteBtn = select('#dbutton');

deleteBtn.addEventListener("click", deleteform);

const postID = window.location.href.split('/')[6];

function deleteform() {
    const req = {};
    const url = `/job/delete/${postID}`;
    
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
            location.href = "/job";
        } else {
            alert(res.msg);
            location.href = "/job/:postID";
        }
    })
    .catch((err) => { // 예외처리
        console.error("글 삭제 중 에러 발생");
    });      
}
