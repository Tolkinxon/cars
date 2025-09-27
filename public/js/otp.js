const email = window.localStorage.getItem('email') || '';
const changePassword = window.localStorage.getItem('change-password') || '';
if (!email) { alert('Please register'); window.location = '/index.html' }


const inputs = document.querySelectorAll(".otp-inputs input");
const elResend = document.querySelector('.js-resend');


async function sendOtp(data) {
    const req = await fetch('http://127.0.0.1:4000/api/auth/verify', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    const res = await req.json();
    if (req.ok) {
        alert(res.message)
        if(changePassword == 'true') return window.location = '/changePassword.html'
        return window.location = '/index.html'
    }
    alert(res.message);
}

async function resendOtp(data) {
    const req = await fetch('http://127.0.0.1:4000/api/auth/resend-otp', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    const res = await req.json();
    alert(res.message);
}


inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
        if (input.value && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && index > 0) {
            inputs[index - 1].focus();
        }
    });
});

document.getElementById("otpForm").addEventListener("submit", (e) => {
    e.preventDefault();
    let otp = "";
    inputs.forEach(input => otp += input.value);
    sendOtp({email, otp})
});

elResend.addEventListener('click', ()=>{
    resendOtp({email});
})

