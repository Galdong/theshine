const writeBtn = document.querySelector('#write');
const form = document.querySelector('#writeForm');

const title = document.querySelector('#title');
const content = document.querySelector('#content');
const image = document.querySelector('#image');

const validateForm = () => {
    if (!title.value) return alert('제목을 입력해주세요.');
    if (!content.value) return alert('내용을 입력해주세요.');

    return true;
}

const max = 5;

if(image) {
    image.addEventListener("change", function () {
        const length = this.files.length;

        if (length > max) {
            alert("사진은 최대 5장까지만 가능합니다.");
            this.value = '';
            return;
        }
    });
}

writeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const valid = validateForm();
    if(valid) {
        const formData = new FormData(form);
        const imageFiles = image.files;

        if (imageFiles.length > max) {
            alert("사진은 최대 5장까지만 가능합니다.");
            return;
        }
        
        if (formData.has("image")) {
            formData.delete("image");
        }

        for (let i = 0; i < imageFiles.length; i++) {
            formData.append("image", imageFiles[i]);
        }

        post(formData);
    }
});

function post(data) {
    fetch("/admin/free/write", {
        method: "POST",
        body: data,
    })
    .then((res) => res.json())
    .then((res) => { 
        if (res.success) {
            location.href = "/admin/freelist"; 
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("글 작성 중 에러 발생");
    });      
}
