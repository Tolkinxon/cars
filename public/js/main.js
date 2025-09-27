const token = window.localStorage.getItem("token") || '';
if(!token) window.location = '/index.html';

const elCarItemTemplate = document.querySelector('.car-item-template').content;
const elCarList = document.querySelector('.js-car-list')

function render(arr, node) {
    node.innerHTML = '';
    const fragment = document.createDocumentFragment();
    arr.forEach(({ brand, _id, title, price, brand_image }) => {
        const clone = elCarItemTemplate.cloneNode(true);
        clone.querySelector('.brand').textContent = brand.name;
        clone.querySelector('.title').textContent = title;
        clone.querySelector('.img').src = brand_image.secure_url || clone.querySelector('.img').src
        clone.querySelector('.js-id-car').dataset.id = _id;
        clone.querySelector('.price').textContent = price;

        fragment.append(clone);
    })
    node.append(fragment);
}

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
    getAccessToken(res)
    console.log(res);
    
    render(res, elCarList);
}
getCars();