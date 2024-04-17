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

    if (!ftitle) return displayMessage('제목을 입력해주세요.', 'red');
    if (!fcontent) return displayMessage('내용을 입력해주세요.', 'red');

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