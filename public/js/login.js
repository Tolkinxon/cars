const email = window.localStorage.getItem('email') || '';

const elFormLogin = document.querySelector('.js-form-login');
const elForgot = document.querySelector('.js-forgot');

async function login(data) {
    const req = await fetch('http://127.0.0.1:4000/api/auth/login',{
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    const res = await req.json();
    if(req.ok) {
        alert(res.message)
        window.localStorage.setItem("token", res.accessToken);
        if(res.role == "admin") return window.location = '/admin.html'
        return window.location = '/main.html'
    }
    alert(res.message);
    window.location.reload();
}

async function forgotPassword(data) {
    const req = await fetch('http://127.0.0.1:4000/api/auth/forgot-password', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    const res = await req.json();
    if(req.ok) {
        alert(res.message);
        window.localStorage.setItem('change-password', true);
        return window.location = '/otp.html'
    }
    alert(res.message);
}

elFormLogin.addEventListener('submit', async (evt)=>{
    evt.preventDefault();
    let user = new FormData(evt.target);
    user = Object.fromEntries(user);
    window.localStorage.setItem('email', user.email);
    await login(user)
})


elForgot.addEventListener('click', async ()=>{
    if (!email) { alert('Please first try to login'); return window.location.reload() }
    await forgotPassword({email});
})

