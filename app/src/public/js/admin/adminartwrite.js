const writeBtn = document.querySelector('#write');
const form = document.querySelector('#writeForm');

const title = document.querySelector('#title');
const content = document.querySelector('#content');
const image = document.querySelector('#image');
const instructorName = document.querySelector('#instructorName');
const category = document.querySelector('#category');
const eduPeriod1 = document.querySelector('#eduPeriod1');
const eduPeriod2 = document.querySelector('#eduPeriod2');
const recruitNum = document.querySelector('#recruitNum');
const receptionPeriod1 = document.querySelector('#receptionPeriod1');
const receptionPeriod2 = document.querySelector('#receptionPeriod2');
const price = document.querySelector('#price');
const status = document.querySelector('#status');

const validateForm = () => {
    if (!title.value) return alert('제목을 입력해주세요.');
    if (!content.value) return alert('내용을 입력해주세요.');
    if (!instructorName.value) return alert('강사명을 입력해주세요.');
    if (category.value == '') return alert('카테고리를 선택해주세요.');
    if (!eduPeriod1.value) return alert('교육기간 시작날짜를 선택해주세요.');
    if (!eduPeriod2.value) return alert('교육기간 종료날짜를 선택해주세요.');
    if (!recruitNum.value) return alert('모집인원을 입력해주세요.');
    if (!receptionPeriod1.value) return alert('접수기간 시작날짜를 선택해주세요.');
    if (!receptionPeriod2.value) return alert('접수기간 종료날짜를 선택해주세요.');
    if (!price.value) return alert('가격을 입력해주세요.');

    return true;
}

let uploadNum = 0;
const max = 5;

if(image) {
    image.addEventListener("change", function (e) {
        const length = this.files.length;

        if (uploadNum + length > max) {
            alert("사진은 최대 5장까지만 가능합니다.");
            this.value = '';
            return;
        }
        uploadNum += length;
    });
}

writeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const valid = validateForm();
    if(valid) {
        const formData = new FormData(form);
        const imageFiles = image.files;

        if (imageFiles.length + uploadNum > max) {
            alert("사진은 최대 5장까지만 가능합니다.");
            return;
        }

        for (let i = 0; i < imageFiles.length; i++) {
            formData.append("image", imageFiles[i]);
        }

        uploadNum += imageFiles.length;
        const eduPeriod = eduPeriod1.value + " ~ " + eduPeriod2.value;
        formData.append('eduPeriod', eduPeriod);
        const receptionPeriod = receptionPeriod1.value + " ~ " + receptionPeriod2.value;
        formData.append('receptionPeriod', receptionPeriod);
        post(formData);
    }
});

function post(data) {
    fetch("/admin/art/write", {
        method: "POST",
        body: data,
    })
    .then((res) => res.json())
    .then((res) => { 
        if (res.success) {
            location.href = "/admin/artlist"; 
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("글 작성 중 에러 발생");
    });      
}
