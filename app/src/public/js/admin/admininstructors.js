const searchBtn = document.querySelector('#search');
const resetBtn = document.querySelectorAll('#reset');
searchBtn.addEventListener("click", search);

function search() {
    const input = document.querySelector('#searchInput').value.toUpperCase();
    const filter = document.querySelector('#searchField').value;
    const table = document.querySelector('#users');
    const tr = table.getElementsByTagName("tr");
    
    let resultFound = false;

    if (!input) {
        alert("검색어를 입력해주세요")
    } else {
        for (let i = 1; i < tr.length; i++) {
            let td = tr[i].getElementsByTagName("td");
            let count = 0;
            for (let j = 0; j < td.length; j++) {
                if (td[j]) {
                    if (td[j].innerHTML.toUpperCase().indexOf(input) > -1 && j == filter) {
                        tr[i].style.display = "";
                        count++;
                        resultFound = true;
                        break;
                    } else {
                        tr[i].style.display = "none";
                    }
                }
            }
        }
        if (!resultFound) {
            const messageRow = table.querySelector('tr.message');
            if (!messageRow) {
                const newRow = table.insertRow(1);
                newRow.classList.add('message');
                const newCell = newRow.insertCell(0);
                newCell.colSpan = tr[0].getElementsByTagName("th").length;
                newCell.textContent = '검색어와 일치하는 결과가 없습니다.';
                newCell.style.textAlign = 'center';
            }
        } else {
            const messageRow = table.querySelector('tr.message');
            if (messageRow) {
                table.deleteRow(1);
            }
        }
        const existBtn = document.querySelector('.allbutton');
        if (existBtn) {
            existBtn.remove();
        }
        const allBtn = document.createElement('button');
        allBtn.classList.add('allbutton');
        allBtn.innerHTML = '<a href="/admin/instructors">전체보기</a>';
        const buttonContainer = document.querySelector('.container');
        buttonContainer.appendChild(allBtn);
    }
}

resetBtn.forEach(function (button) {
    button.addEventListener("click", function() {
        const id = button.closest('tr').querySelector('.id').textContent;
        const response = confirm("비밀번호를 초기화 하시겠습니까? 초기화된 비밀번호는 123456789a 입니다.");
        if (response) {
            reset(id);
        } else {
        }
    });
});
function reset(id) {
    const url = "/admin/users/resetpwd";
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'id': id
        })
    })
    .then((res)=>res.json())
    .then((res) => {
        if (res.success) {
            alert("초기화 되었습니다.");
            location.href = "/admin/instructors";
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("비밀번호 초기화 중 오류 발생");
    });
}