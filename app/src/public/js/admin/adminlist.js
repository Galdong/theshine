const logoutBtn = document.querySelector('#logout');

logoutBtn.addEventListener("click", logout);

function logout() {
    const response = confirm("정말 로그아웃 하시겠습니까?");
    if (response) {
        window.location.href = "/admin/logout";
    } else {
    }
}
document.addEventListener('DOMContentLoaded', function() {
    var dropdownBtns = document.querySelectorAll('.dropdown-btn');

    dropdownBtns.forEach(function(dropdownBtn) {
        dropdownBtn.addEventListener('click', function() {
            dropdownBtns.forEach(function(btn) {
                if (btn !== dropdownBtn) {
                    btn.classList.remove('active');
                    btn.nextElementSibling.style.display = 'none';
                }
            });
            dropdownBtn.classList.toggle('active');
            var dropdownContent = dropdownBtn.nextElementSibling;
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        });
    });

    document.addEventListener('click', function(event) {
        dropdownBtns.forEach(function(dropdownBtn) {
            if (!dropdownBtn.contains(event.target) && !dropdownBtn.nextElementSibling.contains(event.target)) {
                dropdownBtn.classList.remove('active');
                dropdownBtn.nextElementSibling.style.display = 'none';
            }
        });
    });
});

