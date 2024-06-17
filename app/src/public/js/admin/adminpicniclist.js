const searchBtn = document.querySelector('#search');
const writeBtn = document.querySelector('#write');

searchBtn.addEventListener("click", search);
writeBtn.addEventListener("click", writePost);

function search() {
    const input = document.querySelector('#searchInput').value.trim();
    const filter = document.querySelector('#searchField').value;

    if (!input) {
        alert("검색어를 입력해주세요");
        return;
    }
    fetch(`/admin/picniclist/search?keyword=${input}&filter=${filter}`)
        .then(response => response.json())
        .then(data => {
            renderSearchResult(data);
        })
        .catch(error => {
            console.error('검색 중 오류 발생:', error);
        });
}

function renderSearchResult(data) {
    const table = document.querySelector('#picniclist');
    const tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
        tr[i].style.display = "none";
    }
    const pageUl = document.getElementById('page');
    pageUl.style.display = 'none';
    const existBtn = document.querySelector('.allbutton');
    if (existBtn) {
        existBtn.remove();
    }

    if (data.length > 0) {
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="list-title"><a href="/admin/picnicview/${item.postID}">${item.title}</a></td>
                <td class="list-content">${item.content}</td>
                <td>${item.nickname}</td>
                <td>${item.postDate}</td>
            `;
            table.appendChild(row);
        });
    } else {
        const messageRow = table.querySelector('tr.message');
        if (!messageRow) {
            const newRow = table.insertRow(1);
            newRow.classList.add('message');
            const newCell = newRow.insertCell(0);
            newCell.colSpan = tr[0].getElementsByTagName("th").length;
            newCell.textContent = '검색어와 일치하는 결과가 없습니다.';
            newCell.style.textAlign = 'center';
        }
    }
    const allBtn = document.createElement('button');
    allBtn.classList.add('allbutton');
    allBtn.innerHTML = '<a href="/admin/picniclist">전체보기</a>';

    allBtn.style.display = 'block';
    allBtn.style.margin = '10px auto';
    allBtn.style.textAlign = 'center';

    const buttonContainer = document.querySelector('.container');
    buttonContainer.appendChild(allBtn);
}
    

function writePost() {
    location.href = "/admin/picnic/write";
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
                window.location.href = `/admin/picniclist?page=${startPage - pagesPerGroup}`;
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
                window.location.href = `/admin/picniclist?page=${i}`;
            });
            pageUl.appendChild(li);
        }

        if (endPage < totalPages) {
            const nextGroupLi = document.createElement('li');
            nextGroupLi.textContent = '다음';
            nextGroupLi.addEventListener('click', () => {
                window.location.href = `/admin/picniclist?page=${startPage + pagesPerGroup}`;
            });
            pageUl.appendChild(nextGroupLi);
        }
    }

    renderPage(currentPage, totalPages);
});