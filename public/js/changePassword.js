const elChangePassword = document.querySelector('.js-change-password');


async function changePassword(data) {
    const req = await fetch('http://127.0.0.1:4000/api/auth/change-password', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    const res = await req.json();
    if(req.ok) {
        alert(res.message);
        window.localStorage.setItem('change-password', false);
        return window.location = '/index.html'
    }
    alert(res.message);
}


elChangePassword.addEventListener('submit', (evt) => {
    evt.preventDefault();
    let data = new FormData(evt.target);
    data = Object.fromEntries(data);
    if (data.new_password !== data.confirm_password) return alert('data password is not same');
    delete data.confirm_password;
    changePassword(data);
})