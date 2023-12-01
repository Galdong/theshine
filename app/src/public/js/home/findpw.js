const select = (selector) => document.querySelector(selector);

const findBtn = select('#button');

findBtn.addEventListener("click", find);

function find() {
    const req = {
        id: select('#id').value,
        name: select('#name').value,
    };
    
    const url = window.location.href;
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req)
    }) 
    // .then((res) => res.json())
    // .then((res) => { 
    //     if (res.success) {
    //         location.href = "/findpw2";
    //     } else {
    //         alert(res.msg);
    //     }
    // })
    .catch((err) => {
        console.error("비밀번호 찾기 중 에러 발생");
    });
}