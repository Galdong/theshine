const changeBtn = document.querySelectorAll('#change');
const searchBtn = document.querySelector('#search');
const deleteBtn = document.querySelectorAll('#delete');

changeBtn.forEach(function (button) {
    button.addEventListener("click", function() {
        const title = button.closest('tr').querySelector('#title').textContent;
        const id = button.closest('tr').querySelector('#id').textContent;
        const applydate = button.closest('tr').querySelector('#applydate').textContent;
        const response = confirm("신청현황을 변경하시겠습니까?");
        if (response) {
            change(title, id, applydate);
        } else {
        }
    });
});

function change(title, id, applydate) {
    fetch("/admin/proapplylist/change", {
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
            location.href = "/admin/proapplylist";
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("신청현황 변경 중 오류 발생");
    })
}
searchBtn.addEventListener("click", search);

function search() {
    const input = document.querySelector('#searchInput').value.toUpperCase();
    const filter = document.querySelector('#searchField').value;
    const table = document.querySelector('#proapply');
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
        allBtn.innerHTML = '<a href="/admin/proapplylist">전체보기</a>';
        const buttonContainer = document.querySelector('.container');
        buttonContainer.appendChild(allBtn);
    }
}

deleteBtn.forEach(function (button) {
    button.addEventListener("click", function() {
        const title = button.closest('tr').querySelector('.title').textContent;
        const id = button.closest('tr').querySelector('.id').textContent;
        const applydate = button.closest('tr').querySelector('.applydate').textContent;
        const response = confirm("정말로 신청내역을 삭제하시겠습니까?");
        if (response) {
            deleteApply(title, id, applydate);
        } else {
        }
    });
});

function deleteApply(title, id, applydate) {
    fetch("/admin/proapplylist/delete", {
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
            alert("삭제되었습니다.");
            location.href = "/admin/proapplylist";
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("신청내역 삭제 중 오류 발생");
    })
}

document.addEventListener('DOMContentLoaded', (event) => {
    const container = document.querySelector('.container');
    const currentPage = parseInt(container.getAttribute('data-current-page'));
    const totalPages = parseInt(container.getAttribute('data-total-pages'));

    function renderPage(currentPage, totalPages) {
        const pageUl = document.getElementById('page');
        pageUl.innerHTML = '';

        const pagesPerGroup = 5;
        const currentGroup = Math.ceil(currentPage / pagesPerGroup);
        const startPage = (currentGroup - 1) * pagesPerGroup + 1;
        const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

        if (currentGroup > 1) {
            const prevGroupLi = document.createElement('li');
            prevGroupLi.textContent = '이전';
            prevGroupLi.addEventListener('click', () => {
                window.location.href = `/admin/proapplylist?page=${startPage - pagesPerGroup}`;
            });
            pageUl.appendChild(prevGroupLi);
        }

        for (let i = startPage; i <= endPage; i++) {
            const li = document.createElement('li');
            li.textContent = i;
            if (i === currentPage) {
                li.style.fontWeight = 'bold';
            }
            li.addEventListener('click', () => {
                window.location.href = `/admin/proapplylist?page=${i}`;
            });
            pageUl.appendChild(li);
        }

        if (endPage < totalPages) {
            const nextGroupLi = document.createElement('li');
            nextGroupLi.textContent = '다음';
            nextGroupLi.addEventListener('click', () => {
                window.location.href = `/admin/proapplylist?page=${startPage + pagesPerGroup}`;
            });
            pageUl.appendChild(nextGroupLi);
        }
    }

    renderPage(currentPage, totalPages);
});