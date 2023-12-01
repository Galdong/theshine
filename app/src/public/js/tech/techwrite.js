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
    
    const lo = "/tech/" + select('#category').value;

    fetch("/tech/write", {
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
        console.error("글 작성 중 에러 발생");
    });
       
}