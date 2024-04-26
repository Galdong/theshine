const select = (selector) => document.querySelector(selector);

const form = select('.form');
const message = select('.message');
const editBtn = select('#button');

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

let deletedImage = [];

const allOriginalName = document.querySelectorAll('.imageOriginalName');
for (var i=0; i<allOriginalName.length; i++) {
    allOriginalName[i].addEventListener("click", function() {
        this.classList.toggle("active");
    });
    allOriginalName[i].querySelector("button").addEventListener("click", function() {
        const deletedLi = this.closest(".imageOriginalName").innerHTML;
        deletedImage.push(deletedLi);
        this.closest(".imageOriginalName").remove();
    });
}

if(select('#image')) {
    let uploadNum = 0;
    let index = 0;
    select('#image').addEventListener("change", function (e) {
        const formData = new FormData();
        const length = this.files.length + allOriginalName.length - deletedImage.length;
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
        for (let i = 0; i < this.files.length; i++) {
            formData.append("image", this.files[i]);
            index++;
        }
    });
}

editBtn.addEventListener("click", () => {
    const valid = validateForm();
    if (valid) {
        const formData = new FormData(form);
        deletedImage.forEach(content => {
            formData.append("deletedImage", content.slice(0,-19));
        });
        edit(formData);
    }
});

function edit(data) {
    const url = window.location.href;
    fetch(url, {
        method: "POST",
        body: data,
    })  
    .then((res) => res.json()) 
                             
    .then((res) => { 
        if (res.success) {
            location.href = "/free";
        } else {
            alert(res.msg); 
        }
    })
    .catch((err) => { 
        console.error("글 수정 중 에러 발생");
    });
       
}