const deleteBtn = document.querySelector('.delete-button');
const listBtn = document.querySelector('.list-button');

deleteBtn.addEventListener("click", function() {
    const response = confirm("정말로 글을 삭제하시겠습니까?");
    if (response) {
        deletePost();
    } else {
    }
});

listBtn.addEventListener("click", showList);

const postID = window.location.href.split('/')[5];

function deletePost() {
    const url = `/admin/picnicview/delete/${postID}`;
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json" 
        },
    }) 
    .then((res) => res.json()) 
    .then((res) => { 
        if (res.success) {
            location.href = "/admin/picniclist";
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("글 삭제 중 에러 발생");
    });     
}

function showList() {
    location.href = "/admin/picniclist";
}