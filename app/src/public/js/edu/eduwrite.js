const select = (selector) => document.querySelector(selector);
// querySelector 함수화

const form = select('.form'); //class가 form인 태그 선택
const message = select('.message'); // hidden으로 처리되어있는 메시지클래스
const registerBtn = select('#button');

registerBtn.addEventListener("click", post);

const displayMessage = (text, color) => { //에러메시지나 성공메시지 띄우기
    message.style.visibility = 'visible'; //숨겨져있던거 나타남
    message.style.backgroundColor = color;
    message.innerText = text;
    setTimeout(() => {
        message.style.visibility = 'hidden';
    }, 3000); //3초 나타났다 사라짐
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
    
    fetch("/edu/write", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // json타입인것을 명시
        },
        body: JSON.stringify(req) // req object파일을 문자열형태로 바꿔줌
    })  //fetch라는 것을 이용해 브라우저에 입력한 값을 서버에 전송
    .then((res) => res.json()) //서버로 부터 응답이 오면 json 메소드를 호출해서
                               //서버에 응답이 다 받아지는 순간 promise 객체 반환
    .then((res) => { // promise 객체 res에 접근
        if (res.success) {
            location.href = "/edu"; // res.success = true이면 로그인페이지로이동
        } else {
            alert(res.msg); // false이면 메시지출력
        }
    })
    .catch((err) => { // 예외처리
        console.error("글 작성 중 에러 발생");
    });
       
}