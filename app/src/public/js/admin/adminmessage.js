const selectAllCheck = document.querySelector('#selectAll');
const selectUsersCheck = document.querySelector('#selectUsers');
const selectInstructorsCheck = document.querySelector('#selectInstructors');
const messageForm = document.querySelector('#messageForm');

document.addEventListener('DOMContentLoaded', function() {
    selectAllCheck.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.userCheckbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        if (this.checked) {
            selectUsersCheck.checked = false;
            selectInstructorsCheck.checked = false;
        }
    });

    selectUsersCheck.addEventListener('change', function() {
        selectByCategory('user', this.checked);
        if (this.checked) {
            selectAllCheck.checked = false;
        }
    });

    selectInstructorsCheck.addEventListener('change', function() {
        selectByCategory('instructor', this.checked);
        if (this.checked) {
            selectAllCheck.checked = false;
        }
    });

    messageForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const response = confirm("정말로 메시지를 전송하시겠습니까?");
        if (response) {
            sendMessages();
        }
    });
});

function selectByCategory(category, isChecked) {
    const checkboxes = document.querySelectorAll('.userCheckbox');
    checkboxes.forEach(checkbox => {
        if (checkbox.dataset.category === category) {
            checkbox.checked = isChecked;
        }
    });
}

function sendMessages() {
    const message = document.getElementById('message').value;
    const receiver = Array.from(document.querySelectorAll('.userCheckbox:checked')).map(checkbox => checkbox.value);

    if (receiver.length === 0) {
        alert('수신자를 선택하세요');
        return;
    }

    if (!message.trim()) {
        alert('문자 내용을 입력하세요');
        return;
    }

    const payload = { message, receiver };

    fetch("/admin/message", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) {
            alert("문자가 성공적으로 전송되었습니다.");
            location.href = "/admin/message";
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("문자 전송 중 에러 발생");
    }); 
}
