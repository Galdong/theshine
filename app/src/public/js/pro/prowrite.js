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
    const finstructorName = select('#instructorName').value.trim();
    const fcategory = select('#category').value.trim();
    const feduPeriod = select('#eduPeriod').value.trim();
    const frecruitNum = select('#recruitNum').value.trim();
    const freceptionPeriod = select('#receptionPeriod').value.trim();
    const fplace = select('#place').value.trim();

    if (!ftitle) return displayMessage('제목을 입력해주세요.', 'red');
    if (!fcontent) return displayMessage('내용을 입력해주세요.', 'red');
    if (!finstructorName) return displayMessage('강사명을 입력해주세요.', 'red');
    if (fcategory == '0') return displayMessage('카테고리를 선택해주세요.', 'red');
    if (!feduPeriod) return displayMessage('교육기간을 입력해주세요.', 'red');
    if (!frecruitNum) return displayMessage('모집인원을 입력해주세요.', 'red');
    if (!freceptionPeriod) return displayMessage('접수기간을 입력해주세요.', 'red');
    if (!fplace) return displayMessage('장소를 입력해주세요.', 'red');

    return true;
}

if(select('#image')) {
    let uploadNum = 0;
    let index = 0;
    select('#image').addEventListener("change", function (e) {
        const formData = new FormData();
        const length = this.files.length;
        const max = 5; // 사진 최대 5장 업로드가능
        switch (uploadNum) {
            case 0:
                if (length > max - uploadNum) {
                    alert("사진은 최대 5장까지만 가능합니다.");
                    return;
                  }
                  uploadNum += length;
                  break;
            case 1:
                if (length > max - uploadNum) {
                    alert("사진은 최대 5장까지만 가능합니다.");
                    return;
                  }
                  uploadNum += length;
                  break;
            case 2:
                if (length > max - uploadNum) {
                    alert("사진은 최대 5장까지만 가능합니다.");
                    return;
                    }
                    uploadNum += length;
                    break;
            case 3:
                if (length > max - uploadNum) {
                    alert("사진은 최대 5장까지만 가능합니다.");
                    return;
                    }
                    uploadNum += length;
                    break;
            case 4:
                if (length > max - uploadNum) {
                    alert("사진은 최대 5장까지만 가능합니다.");
                    return;
                    }
                    uploadNum += length;
                    break;
            default:
                alert("사진은 최대 5장까지만 가능합니다.");
                return; 
        }
        for (let i = 0; i < length; i++) {
            formData.append("image", this.files[i]);
            index++;
        }
    });
}

registerBtn.addEventListener("click", () => {
    const valid = validateForm();
    if(valid) {
        const formData = new FormData(form);
        post(formData);
    }
});

function post(data) {
    const lo = "/pro/" + select('#category').value;

    fetch("/pro/write", {
        method: "POST",
        body: data,
    })
    .then((res) => res.json())
    .then((res) => { 
        if (res.success) {
            location.href = lo; // 작성한 카테고리 페이지로 이동
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("글 작성 중 에러 발생");
    });      
}