const token = window.localStorage.getItem("token") || '';
if (!token) window.location = '/index.html';

const elCarItemTemplate = document.querySelector('.car-item-template').content;
const elCarList = document.querySelector('.js-car-list');
const elLogout = document.querySelector('.logout');
const elAdmin = document.querySelector('.admin');


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
    const req = await fetch('http://127.0.0.1:4000/api/car/all', {
        headers: {
            token: token
        }
    })
    const res = await req.json();
    getAccessToken(res)
    if (req.ok) {
        return render(res, elCarList);
    }
    alert(res.message);
}
getCars();
async function getCar(id) {
    const req = await fetch(`http://127.0.0.1:4000/api/car/${id}`, {
        headers: {
            token: token
        }
    })
    const res = await req.json();
    getAccessToken(res)
    if (req.ok) {
        if (res) {
            myModal.style.display = 'block';
            const { brand, color, year, gearbook, engine, tinting, distance, description, price, brand_image, inner_image, outer_image } = res;
            myModal.querySelector('.year').textContent = year;
            myModal.querySelector('.engine').textContent = engine;
            myModal.querySelector('.tinting').textContent = tinting ? "Bor" : "Yo'q";
            myModal.querySelector('.color').textContent = color;
            myModal.querySelector('.brand').textContent = brand.name;
            myModal.querySelector('.distance').textContent = distance;
            myModal.querySelector('.gearbook').textContent = gearbook;
            myModal.querySelector('.distance').textContent = distance;
            myModal.querySelector('.description').textContent = description;
            myModal.querySelector('.price').textContent = price;
            myModal.querySelector('.brand_image').src = brand_image.secure_url ? brand_image.secure_url : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNUOu5kkYIXpcfVS97f1I42o9MnsCL2RrN_33gNdUYpUNKT9hwBe7Oko7lW_-TQ_Y7kKM&usqp=CAU';
            myModal.querySelector('.inner_image').src = inner_image.secure_url ? inner_image.secure_url : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNUOu5kkYIXpcfVS97f1I42o9MnsCL2RrN_33gNdUYpUNKT9hwBe7Oko7lW_-TQ_Y7kKM&usqp=CAU';
            myModal.querySelector('.outer_image').src = outer_image.secure_url ? outer_image.secure_url : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNUOu5kkYIXpcfVS97f1I42o9MnsCL2RrN_33gNdUYpUNKT9hwBe7Oko7lW_-TQ_Y7kKM&usqp=CAU';
            myModal.querySelector('.exterior').checked = true;
            myModal.querySelector('.outer_image').style.display = 'block'
            myModal.querySelector('.inner_image').style.display = 'none'
            return true;
        }
    }
    alert(res.message);
}

elCarList.addEventListener('click', (evt) => {
    let target = evt.target;
    while (!target.matches('.js-id-car')) {
        target = target.parentNode
    }
    const id = target.dataset.id;
    window.localStorage.setItem('userCarId', id);
    getCar(id);
})

async function logout() {
    const req = await fetch('http://127.0.0.1:4000/api/auth/logout', {
        method: 'POST',
        headers: {
            token: token
        },
        credentials: "include"
    })
    const res = await req.json();
    getAccessToken(res)
    if (req.ok) {
        alert(res.message);
        window.localStorage.clear();
        return window.location = '/index.html';
    }
    alert(res.message)
}

elLogout.addEventListener('click', () => {
    logout();
})

heard1.addEventListener("click",(evt) => {
    heard1.style.display = 'none';
    heard2.style.display = 'block';
})

heard2.addEventListener("click",(evt) => {
    heard1.style.display = 'block'; 
    heard2.style.display = 'none';
})

elAdmin.addEventListener("click", ()=>{
    window.location = '/admin.html'
})

