const select = (selector) => document.querySelector(selector);

const form = select('.form');
const message = select('.message');
const editBtn = select('#button');

const displayMessage = (text, color) => {
    message.style.visibility = 'visible';
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
    const finstructor_name = select('#instructor_name').value.trim();
    const fcategory = select('#category').value.trim();
    const fedu_period = select('#edu_period').value.trim();
    const frecruit_num = select('#recruit_num').value.trim();
    const freceipt_period = select('#receipt_period').value.trim();
    const flocation = select('#location').value.trim();

    const exceptedImageFiles = ['jpg', 'jpeg', 'png'];
    const extension = fimage.split('.').pop();

    if (!ftitle) return displayMessage('제목을 입력해주세요.', 'red');
    if (!fcontent) return displayMessage('내용을 입력해주세요.', 'red');
    if (!exceptedImageFiles.includes(extension)) return displayMessage('이미지 파일만 가능합니다.', 'red');
    if (!finstructor_name) return displayMessage('강사명을 입력해주세요.', 'red');
    if (fcategory == '0') return displayMessage('카테고리를 선택해주세요.', 'red');
    if (!fedu_period) return displayMessage('교육기간을 입력해주세요.', 'red');
    if (!frecruit_num) return displayMessage('모집인원을 입력해주세요.', 'red');
    if (!freceipt_period) return displayMessage('접수기간을 입력해주세요.', 'red');
    if (!flocation) return displayMessage('장소를 입력해주세요.', 'red');

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
    const lo = "/tech/" + select('#category').value;
    
    const url = window.location.href;
    fetch(url, {
        method: "POST",
        body: data,
    }) 
    .then((res) => res.json())
    .then((res) => { 
        if (res.success) {
            location.href = lo;
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => { 
        console.error("글 수정 중 에러 발생");
    });
       
}