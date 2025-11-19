// products.js: Lógica para AGREGAR productos al carrito

let carrito = []; 
const contenedorProductos = document.querySelector('.contenedorPadre');
const contadorCarritoDOM = document.getElementById('contador-carrito');

// Cargar el carrito desde localStorage al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
    
    // Inicializar el contador visual
    actualizarContador(); 

    // Escucha clics en los botones de "Comprar"
    contenedorProductos.addEventListener('click', (e) => {
        if (e.target.classList.contains('boton-comprar')) {
            agregarProducto(e.target.parentElement);
        }
    });
});

// Función para Agregar Producto
function agregarProducto(productoElemento) {
    const infoProducto = {
        id: productoElemento.querySelector('button').getAttribute('data-id'),
        nombre: productoElemento.getAttribute('data-nombre'),
        precio: parseFloat(productoElemento.getAttribute('data-precio')),
        cantidad: 1
    };

    const existe = carrito.some(item => item.id === infoProducto.id);

    if (existe) {
        // Si ya existe, aumentar la cantidad
        carrito = carrito.map(item => {
            if (item.id === infoProducto.id) {
                item.cantidad++;
            }
            return item;
        });
    } else {
        // Si no existe, agregarlo al array
        carrito.push(infoProducto);
    }
    
    // Guardar el carrito y actualizar el contador
    guardarYActualizar();
}

// Función para guardar en localStorage y actualizar el contador
function guardarYActualizar() {
    // 1. Guardar el array 'carrito' en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito)); 
    
    // 2. Actualizar el contador
    actualizarContador();
}

function actualizarContador() {
    // Calcula la suma de las cantidades de todos los productos
    const totalItems = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    
    if (contadorCarritoDOM) {
        contadorCarritoDOM.textContent = totalItems;
    }
}