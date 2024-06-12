const logoutBtn = document.querySelector('#logout');

logoutBtn.addEventListener("click", logout);

function logout() {
    const response = confirm("정말 로그아웃 하시겠습니까?");
    if (response) {
        window.location.href = "/admin/logout";
    } else {
    }
}