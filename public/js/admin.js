const token = window.localStorage.getItem("token") || '';
if(!token) window.location = '/index.html';
const elCarItem = document.querySelector('.car-tr-template').content;
const elCarList = document.querySelector('.js-car-list')

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

function render(arr, node){
  node.innerHTML = '';
  const fragment = document.createDocumentFragment();
  arr.forEach(({ brand, color, distance, engine, gearbook, year, tinting }) => {
    const clone = elCarItem.cloneNode(true);
    clone.querySelector('.brand').textContent = brand.name;
    clone.querySelector('.color').textContent = color;
    clone.querySelector('.distance').textContent = distance;
    clone.querySelector('.engine').textContent = engine;
    clone.querySelector('.gearbook').textContent = gearbook;
    clone.querySelector('.year').textContent = year;
    clone.querySelector('.tinting').textContent = tinting ? 'Bor' : "Yo'q";

    fragment.append(clone);
  })
  node.append(fragment);
}

async function getCars() {
    const req = await fetch('http://127.0.0.1:4000/api/car/all',{
        headers: {
            token: token
        }
    })
    const res = await req.json();
    getAccessToken(res)
    render(res, elCarList);
    console.log(res);
}

getCars();

