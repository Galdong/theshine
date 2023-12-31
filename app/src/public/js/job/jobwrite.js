const select = (selector) => document.querySelector(selector);
// querySelector 함수화

const form = select('.form'); //class가 form인 태그 선택
const message = select('.message'); // hidden으로 처리되어있는 메시지클래스
const registerBtn = select('#button');

const displayMessage = (text, color) => { //에러메시지나 성공메시지 띄우기
    message.style.visibility = 'visible'; //숨겨져있던거 나타남
    message.style.backgroundColor = color;
    message.innerText = text;
    setTimeout(() => {
        message.style.visibility = 'hidden';
    }, 3000); //3초 나타났다 사라짐
}

const validateForm = () => {
    const ftitle = select('#title').value.trim();
    const fcontent = select('#content').value.trim();
    const fimage = select('#image').value;
    const fcompanyname = select('#companyname').value.trim();
    const fsector = select('#sector').value.trim();
    const fbusinessinfo = select('#businessinfo').value.trim();
    const fstartdate = select('#startdate').value.trim();
    const femployeenum = select('#employeenum').value.trim();
    const fceoname = select('#ceoname').value.trim();

    const exceptedImageFiles = ['jpg', 'jpeg', 'png'];
    const extension = fimage.split('.').pop();

    if (!ftitle) return displayMessage('제목을 입력해주세요.', 'red');
    if (!fcontent) return displayMessage('내용을 입력해주세요.', 'red');
    if (!exceptedImageFiles.includes(extension)) return displayMessage('이미지 파일만 가능합니다.', 'red');
    if (!fcompanyname) return displayMessage('기업명을 입력해주세요.', 'red');
    if (!fsector) return displayMessage('업종을 입력해주세요.', 'red');
    if (!fbusinessinfo) return displayMessage('사업내용을 입력해주세요.', 'red');
    if (!fstartdate) return displayMessage('설립일을 입력해주세요.', 'red');
    if (!femployeenum) return displayMessage('사원수를 입력해주세요.', 'red');
    if (!fceoname) return displayMessage('대표자명을 입력해주세요.', 'red');

    return true;
}

registerBtn.addEventListener("click", () => {
    const valid = validateForm();
    if(valid) {
        const formData = new FormData(form);
        post(formData);
    }
});

function post(data) {
    fetch("/job/write", {
        method: "POST",
        body: data,
    })
    .then((res) => res.json())
    .then((res) => { 
        if (res.success) {
            location.href = "/job"; 
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("글 작성 중 에러 발생");
    });
       
}