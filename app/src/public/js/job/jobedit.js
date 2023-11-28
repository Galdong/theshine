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
    const fcompanyname = select('#companyname').value.trim();
    const fsector = select('#sector').value.trim();
    const fbusinessinfo = select('#businessinfo').value.trim();
    const fstartdate = select('#startdate').value.trim();
    const femployeenum = select('#employeenum').value.trim();
    const fceoname = select('#ceoname').value.trim();

    if (!ftitle) return displayMessage('제목을 입력해주세요.', 'red');
    if (!fcontent) return displayMessage('내용을 입력해주세요.', 'red');
    if (!fcompanyname) return displayMessage('기업명을 입력해주세요.', 'red');
    if (!fsector) return displayMessage('업종을 입력해주세요.', 'red');
    if (!fbusinessinfo) return displayMessage('사업내용을 입력해주세요.', 'red');
    if (!fstartdate) return displayMessage('설립일을 입력해주세요.', 'red');
    if (!femployeenum) return displayMessage('사원수를 입력해주세요.', 'red');
    if (!fceoname) return displayMessage('대표자명을 입력해주세요.', 'red');

    const req = {
        title: select('#title').value,
        content: select('#content').value,
        companyname: select('#companyname').value,
        sector: select('#sector').value,
        businessinfo: select('#businessinfo').value,
        startdate: select('#startdate').value,
        employeenum: select('#employeenum').value,
        ceoname: select('#ceoname').value,
        boardno: select('#boardno').innerText,
    };
    
    const url = window.location.href;
    fetch(url, {
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
            location.href = "/job"; // res.success = true이면 로그인페이지로이동
        } else {
            alert(res.msg); // false이면 메시지출력
        }
    })
    .catch((err) => { // 예외처리
        console.error("글 수정 중 에러 발생");
    });
       
}