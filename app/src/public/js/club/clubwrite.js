const select = (selector) => document.querySelector(selector);

const form = select('.form'); 
const message = select('.message'); 
const registerBtn = select('#button');

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

    const exceptedImageFiles = ['jpg', 'jpeg', 'png'];
    const extension = fimage.split('.').pop();

    if (!ftitle) return displayMessage('제목을 입력해주세요.', 'red');
    if (!fcontent) return displayMessage('내용을 입력해주세요.', 'red');
    if (!exceptedImageFiles.includes(extension)) return displayMessage('이미지 파일만 가능합니다.', 'red');

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
    fetch("/club/write", {
        method: "POST",
        body: data,
    }) 
    .then((res) => res.json())     
    .then((res) => { 
        if (res.success) {
            location.href = "/club"; 
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => { 
        console.error("글 작성 중 에러 발생");
    });
       
}