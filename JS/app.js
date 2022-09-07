console.log("Enlazado a js")
const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templatecard = document.getElementById('template-card').content
const templatefooter = document.getElementById('template-footer').content
const templatecarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})
cards.addEventListener('click', e => {
    addCarrito(e)
})
items.addEventListener('click', e => {
    aumentarDisminuir(e)
})

const aumentarDisminuir = e => {
    if(e.target.classList.contains('btn-info')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        pintarCarrito()
    }
    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }else{
        carrito[e.target.dataset.id] = { ...producto }
        }
        pintarCarrito()
    }
    e.stopPropagation()
}

const addCarrito = e => {
    //console.log(e)
    if(e.target.classList.contains('btn-dark')){
        //console.log(e.target.parentElement)
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
    
}

const setCarrito = item => {
    const producto = {
        title: item.querySelector('h5').textContent,
        precio: item.querySelector('p').textContent,
        id: item.querySelector('button').dataset.id,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto}
    //console.log(carrito)
    pintarCarrito()
}

const pintarCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach( producto => {
        //console.log(producto)
        templatecarrito.querySelector('th').textContent = producto.id
        templatecarrito.querySelectorAll('td')[0].textContent = producto.title
        templatecarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templatecarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        templatecarrito.querySelector('.btn-info').dataset.id = producto.id
        templatecarrito.querySelector('.btn-danger').dataset.id = producto.id

        const clone = templatecarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    pintarFooter()
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML =
        `
        <th scope="row" colspan="5">Carrito vacio</th>
        `
        return
    }

    const nCantindad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + (cantidad * precio), 0)

    templatefooter.querySelectorAll('td')[0].textContent = nCantindad
    templatefooter.querySelector('span').textContent = nPrecio

    const clone = templatefooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}

const fetchData = async () => {
    const productos = await fetch('../API/api.json')
    const data = await productos.json()
    pintarCards(data)
    //console.log(productos, data)
}

const pintarCards = data => {
    data.forEach(item => {
        //console.log(item)
        templatecard.querySelector('img').setAttribute("src", item.url) 
        templatecard.querySelector('h5').textContent = item.title 
        templatecard.querySelector('p').textContent = item.precio
        templatecard.querySelector('button').dataset.id = item.id

        const clone = templatecard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}
