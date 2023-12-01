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
    const fcontent = select('#content').value.trim();
    const finstructor_name = select('#instructor_name').value.trim();
    const fcategory = select('#category').value.trim();
    const fedu_period = select('#edu_period').value.trim();
    const frecruit_num = select('#recruit_num').value.trim();
    const freceipt_period = select('#receipt_period').value.trim();
    const flocation = select('#location').value.trim();


    if (!ftitle) return displayMessage('제목을 입력해주세요.', 'red');
    if (!fcontent) return displayMessage('내용을 입력해주세요.', 'red');
    if (!finstructor_name) return displayMessage('강사명을 입력해주세요.', 'red');
    if (fcategory == '0') return displayMessage('카테고리를 선택해주세요.', 'red');
    if (!fedu_period) return displayMessage('교육기간을 입력해주세요.', 'red');
    if (!frecruit_num) return displayMessage('모집인원을 입력해주세요.', 'red');
    if (!freceipt_period) return displayMessage('접수기간을 입력해주세요.', 'red');
    if (!flocation) return displayMessage('장소를 입력해주세요.', 'red');
    
    const req = {
        title: select('#title').value,
        content: select('#content').value,
        instructor_name: select('#instructor_name').value,
        category: select('#category').value,
        edu_period: select('#edu_period').value,
        recruit_num: select('#recruit_num').value,
        receipt_period: select('#receipt_period').value,
        location: select('#location').value,
        status: select('#status').value,
    };
    
    const lo = "/arte/" + select('#category').value;
    
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
            location.href = lo;
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => { 
        console.error("글 수정 중 에러 발생");
    });
       
}