const form = select('.form');
const registerBtn = select('#button');
const comDelBtn = document.querySelectorAll('.cdbutton');

if (comDelBtn.length > 0) {
    comDelBtn.forEach(btn => {
        btn.addEventListener("click", function() {
            const commentID = btn.getAttribute('data-commentID');
            deleteComment(commentID);
        });
    });
}

const validateForm = () => {
    const content = select('#content').value;
    if (!content) return alert('내용을 입력해주세요');

    return true;
}

registerBtn.addEventListener("click", () => {
    const valid = validateForm();
    if (valid) {
        const content = select('#content').value;
        const data = {
            content: content
        };
        postComment(data);
    }
});

function postComment(data) {
    const url = `/free/comment/${postID}`;
    fetch(url, {
        method : "POST",
        headers : {
            "Content-Type": "application/json",
        },
        body : JSON.stringify(data)
    })
    .then((res) => res.json())     
    .then((res) => { 
        if (res.success) {
            location.href = window.location.href; 
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => { 
        console.error("댓글 작성 중 에러 발생");
    });
}

function deleteComment(commentID) {
    const req = {};
    const url = `/free/comment/${postID}/delete/${commentID}`

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
            location.href = window.location.href;
        } else {
            alert(res.msg);
        }
    });
}
