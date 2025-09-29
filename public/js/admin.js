const token = window.localStorage.getItem("token") || '';
if (!token) window.location = '/index.html';
const elCarItem = document.querySelector('.car-tr-template').content;
const elCarList = document.querySelector('.js-car-list');
const elForm = document.querySelector('.js-add-car-form');
const elUpdateForm = document.querySelector('.js-update-car-form');
const elLogout = document.querySelector('.logout');
const elMainAdmin = document.querySelector('.mainAdmin');

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

let carData = [];

function render(arr, node) {
    node.innerHTML = '';
    const fragment = document.createDocumentFragment();
    arr.forEach(({ brand, color, distance, engine, gearbook, year, tinting, _id }) => {
        const clone = elCarItem.cloneNode(true);
        clone.querySelector('.brand').textContent = brand.name;
        clone.querySelector('.color').textContent = color;
        clone.querySelector('.distance').textContent = distance;
        clone.querySelector('.engine').textContent = engine;
        clone.querySelector('.gearbook').textContent = gearbook;
        clone.querySelector('.year').textContent = year;
        clone.querySelector('.js-id-car').dataset.id = _id;
        clone.querySelector('.tinting').textContent = tinting ? 'Bor' : "Yo'q";

        fragment.append(clone);
    })
    node.append(fragment);
}

async function getCars() {
    const req = await fetch('http://127.0.0.1:4000/api/car/all', {
        headers: {
            token: token
        }
    })
    const res = await req.json();
    getAccessToken(res)
    render(res, elCarList);
    carData = res;
    console.log(res);
}
getCars();

async function updateCar(id, data) {
    const req = await fetch(`http://127.0.0.1:4000/api/car/${id}`, {
        method: 'PUT',
        headers: {
            token: token
        },
        body: data
    })
    const res = await req.json();
    getAccessToken(res)
    if(req.ok){
        alert(res.message);
        modalUpdateOverlay.click();
        return window.location.reload();
    }
    alert(res.message)
}

async function deleteCar(id) {
    const req = await fetch(`http://127.0.0.1:4000/api/car/${id}`, {
        method: 'DELETE',
        headers: {
            token: token
        },
    })
    const res = await req.json();
    getAccessToken(res)
    if(req.ok){
        alert(res.message);
        modalUpdateOverlay.click();
        return window.location.reload();
    }
    alert(res.message);
}

async function sendCarData(data) {
    const req = await fetch('http://127.0.0.1:4000/api/car/create', {
        method: 'POST',
        headers: { token: token },
        body: data
    })
    const res = await req.json();
    getAccessToken(res)
    if (req.ok) {
        alert(res.message)
        modalOverlay.click();
        return window.location.reload();

    }
    alert(res.message);
}

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
    if(req.ok){
        alert(res.message);
        window.localStorage.clear();
        return window.location = '/index.html';
    }
    alert(res.message)
}

elForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    let car = new FormData(elForm);
    sendCarData(car)
})

elCarList.addEventListener('click', (evt) => {
    if (evt.target.matches('.js-id-car')) {
        const id = evt.target.dataset.id;
        window.localStorage.setItem('carId', id);
        openUpdateModalBtn.click();
        const car = carData.find(item => item._id == id)
        Object.keys(car).forEach((key) => {
            const field = elUpdateForm.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === "file") {
                    return; 
                }
                field.value = car[key];
            }
        });
    }
})

elUpdateForm.addEventListener('submit', async (evt) => {
    const id = window.localStorage.getItem('carId');
    evt.preventDefault();
    if(evt.submitter.matches('.update-btn')){
        let car = new FormData(elUpdateForm);
        updateCar(id, car);
    }
    if(evt.submitter.matches('.delete-btn')){
        deleteCar(id);
    }
})

elLogout.addEventListener('click', ()=> {
    logout();
})

elMainAdmin.addEventListener('click', ()=>{
    window.location = '/firstAdmin.html'
})

