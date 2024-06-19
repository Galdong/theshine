const deleteBtn = document.querySelector('.delete-button');
const listBtn = document.querySelector('.list-button');
const commentBtn = document.querySelector('.comment-write');
const commentDelBtns = document.querySelectorAll('.comment-delete');
const postID = window.location.href.split('/')[5];

deleteBtn.addEventListener("click", function() {
    const response = confirm("정말로 글을 삭제하시겠습니까?");
    if (response) {
        deletePost();
    } else {
    }
});

listBtn.addEventListener("click", showList);
commentBtn.addEventListener("click", writeComment);

commentDelBtns.forEach(function(commentDelBtn) {
    commentDelBtn.addEventListener("click", function() {
        const response = confirm("정말로 댓글을 삭제하시겠습니까?");
        if (response) {
            const commentID = this.getAttribute('data-commentID');
            deleteComment(commentID);
        }
    });
});


function deletePost() {
    const url = `/admin/clubview/delete/${postID}`;
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json" 
        },
    }) 
    .then((res) => res.json()) 
    .then((res) => { 
        if (res.success) {
            location.href = "/admin/clublist";
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("글 삭제 중 에러 발생");
    });     
}

function showList() {
    location.href = "/admin/clublist";
}

function writeComment() {
    const content = document.querySelector('#commentContent').value;
    if (!content) return alert("댓글 내용을 입력해주세요.");
    
    fetch(`/admin/clubview/commentwrite/${postID}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ content })
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
    fetch(`/admin/clubview/commentdelete/${commentID}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json" 
        },
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
        console.error("댓글 삭제 중 에러 발생");
    });    
}