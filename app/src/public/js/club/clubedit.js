const select = (selector) => document.querySelector(selector);
// querySelector 함수화

const form = select('.form'); //class가 form인 태그 선택
const message = select('.message'); // hidden으로 처리되어있는 메시지클래스
const editBtn = select('#button');

editBtn.addEventListener("click", edit);

const displayMessage = (text, color) => { //에러메시지나 성공메시지 띄우기
    message.style.visibility = 'visible'; //숨겨져있던거 나타남
    message.style.backgroundColor = color;
    message.innerText = text;
    setTimeout(() => {
        message.style.visibility = 'hidden';
    }, 3000); //3초 나타났다 사라짐
}

function edit() {
    const ftitle = select('#title').value.trim(); 
    // id가 title인 제목 변수로 지정 , trim = 공백 제거
    const fcontent = select('#content').value.trim();

    if (!ftitle) return displayMessage('제목을 입력해주세요.', 'red');
    if (!fcontent) return displayMessage('내용을 입력해주세요.', 'red');
    
    const req = {
        title: select('#title').value,
        content: select('#content').value,
        boardno: select('#boardno').innerText,
    };
    
    const url = window.location.href;
    fetch(url, {
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
        console.error("글 수정 중 에러 발생");
    });
       
}