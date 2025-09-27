const elFormRegister = document.querySelector('.js-form-register');

async function sendUserData(data) {
    const req = await fetch('http://127.0.0.1:4000/api/auth/register', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    const res = await req.json();
    if (req.ok) {
        alert(res.message)
        return window.location = '/otp.html'
    }
    if (res.message == 'User already exists') { alert(res.message); return window.location.reload(); }
    alert(res.message);
}

elFormRegister.addEventListener('submit', (evt) => {
    evt.preventDefault();
    let user = new FormData(evt.target);
    user = Object.fromEntries(user);
    window.localStorage.setItem('email', user.email);
    if (user.password !== user.repeat_password) return alert('User password is not same');
    delete user.repeat_password;
    sendUserData(user);
})