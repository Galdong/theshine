const select = (selector) => document.querySelector(selector);

const form = select('.form'); 
const message = select('.message'); 
const registerBtn = select('#button');

registerBtn.addEventListener("click", post);

const displayMessage = (text, color) => { 
    message.style.visibility = 'visible'; 
    message.style.backgroundColor = color;
    message.innerText = text;
    setTimeout(() => {
        message.style.visibility = 'hidden';
    }, 3000); 
}

function post() {
    const ftitle = select('#title').value.trim(); 
    const fcontent = select('#content').value.trim();

    if (!ftitle) return displayMessage('제목을 입력해주세요.', 'red');
    if (!fcontent) return displayMessage('내용을 입력해주세요.', 'red');
    
    const req = {
        title: select('#title').value,
        content: select('#content').value,
    };
    
    fetch("/club/write", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(req) 
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