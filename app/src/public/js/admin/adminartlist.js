const changeBtn = document.querySelectorAll('#change');

changeBtn.forEach(function (button) {
    button.addEventListener("click", function() {
        const title = button.closest('tr').querySelector('.title').textContent;
        const id = button.closest('tr').querySelector('.id').textContent;
        const applydate = button.closest('tr').querySelector('.applydate').textContent;
        const response = confirm("신청현황을 변경하시겠습니까?");
        if (response) {
            change(title, id, applydate);
        } else {
        }
    });
});

function change(title, id, applydate) {
    fetch("/admin/artapplylist/change", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'title': title,
            'id': id,
            'applydate': applydate
        })
    })
    .then((res)=>res.json())
    .then((res) => {
        if (res.success) {
            alert("변경되었습니다.");
            location.href = "/admin/artapplylist";
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("신청현황 변경 중 오류 발생");
    })
}