const select = (selector) => document.querySelector(selector);
// querySelector 함수화

const form = select('.form'); //class가 form인 태그 선택
const message = select('.message'); // hidden으로 처리되어있는 메시지클래스
const editBtn = select('#button');

const displayMessage = (text, color) => { //에러메시지나 성공메시지 띄우기
    message.style.visibility = 'visible'; //숨겨져있던거 나타남
    message.style.backgroundColor = color;
    message.innerText = text;
    setTimeout(() => {
        message.style.visibility = 'hidden';
    }, 3000);
}

const validateForm = () => {
    const ftitle = select('#title').value.trim();
    const fcontent = select('#content').value.trim();
    const fimage = select('#image').value;
    const fcompanyName = select('#companyName').value.trim();
    const findustry = select('#industry').value.trim();
    const fproject = select('#project').value.trim();
    const fstartDate = select('#startDate').value.trim();
    const femployeeNum = select('#employeeNum').value.trim();
    const fceoName = select('#ceoName').value.trim();
    const exceptedImageFiles = ['jpg', 'jpeg', 'png'];
    const extension = fimage.split('.').pop();

    if (!ftitle) return displayMessage('제목을 입력해주세요.', 'red');
    if (!fcontent) return displayMessage('내용을 입력해주세요.', 'red');
    if (!exceptedImageFiles.includes(extension)) return displayMessage('이미지 파일만 가능합니다.', 'red');
    if (!fcompanyName) return displayMessage('기업명을 입력해주세요.', 'red');
    if (!findustry) return displayMessage('업종을 입력해주세요.', 'red');
    if (!fproject) return displayMessage('사업내용을 입력해주세요.', 'red');
    if (!fstartDate) return displayMessage('설립일을 입력해주세요.', 'red');
    if (!femployeeNum) return displayMessage('사원수를 입력해주세요.', 'red');
    if (!fceoName) return displayMessage('대표자명을 입력해주세요.', 'red');

    return true;
}

editBtn.addEventListener("click", () => {
    const valid = validateForm();
    if (valid) {
        const formData = new FormData(form);
        edit(formData);
    }
});

function edit(data) {
    const url = window.location.href;
    fetch(url, {
        method: "POST",
        body: data, 
    }) 
    .then((res) => res.json()) 
    .then((res) => { 
        if (res.success) {
            location.href = "/job"; // res.success = true이면 로그인페이지로이동
        } else {
            alert(res.msg); // false이면 메시지출력
        }
    })
    .catch((err) => { // 예외처리
        console.error("글 수정 중 에러 발생");
    });
       
}