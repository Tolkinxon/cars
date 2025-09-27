const token = window.localStorage.getItem("token") || '';
if(!token) window.location = '/index.html';

async function getAccessToken(err) {
    if (err.code == 'TOKEN_EXPIRED') {
        const req = await fetch(`http://127.0.0.1:4000/api/auth/refresh`, {
            method: "GET",
            credentials: "include"
        });
        let res = await req.json();
        if (res.accessToken) {
            window.localStorage.setItem("token", res.accessToken);
        }
    } else return true;
}

async function getCars() {
    const req = await fetch('http://127.0.0.1:4000/api/car/all',{
        headers: {
            token: token
        }
    })
    const res = await req.json();
    console.log(res);
    getAccessToken(res)
}

getCars();