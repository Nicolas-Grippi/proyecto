// carrito.js: Lógica para MOSTRAR, RESTAR y ELIMINAR productos del carrito

// Variables del DOM
const listaCarritoDOM = document.getElementById('lista-carrito');
const totalCarritoDOM = document.getElementById('total-carrito');
const btnVaciar = document.getElementById('vaciar-carrito');

let carrito = []; 

document.addEventListener('DOMContentLoaded', () => {
    cargarCarritoDesdeStorage();
    actualizarCarritoHTML(); 
    
    // Evento Delegado para los botones de acción (Restar y Eliminar)
    listaCarritoDOM.addEventListener('click', manejarAccionesCarrito);
    btnVaciar.addEventListener('click', vaciarCarrito);
});

// --- Funciones de Lógica ---

function cargarCarritoDesdeStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
}

function manejarAccionesCarrito(e) {
    if (e.target.classList.contains('btn-eliminar') || e.target.classList.contains('btn-restar')) {
        const productoId = e.target.getAttribute('data-id');

        if (e.target.classList.contains('btn-eliminar')) {
            eliminarProducto(productoId);
        } else if (e.target.classList.contains('btn-restar')) {
            restarUnidad(productoId);
        }
    }
}

function restarUnidad(id) {
    carrito = carrito.map(item => {
        if (item.id === id && item.cantidad > 0) {
            item.cantidad--; 
        }
        return item;
    });

    // Filtramos para eliminar ítems cuya cantidad llegue a cero
    carrito = carrito.filter(item => item.cantidad > 0);
    
    guardarYActualizar();
}

function eliminarProducto(id) {
    // Filtramos, dejando solo los productos cuyo ID no coincida
    carrito = carrito.filter(item => item.id !== id);
    
    guardarYActualizar();
}

function vaciarCarrito() {
    if (confirm('¿Estás seguro que deseas vaciar todo el carrito?')) {
        carrito = []; 
        guardarYActualizar();
    }
}

function guardarYActualizar() {
    // 1. Guardar en localStorage para persistencia
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // 2. Actualizar la vista en carrito.html
    actualizarCarritoHTML();
}


// --- Función de Renderizado (Mostrar en HTML) ---

function actualizarCarritoHTML() {
    listaCarritoDOM.innerHTML = ''; 
    let total = 0;

    if (carrito.length === 0) {
        listaCarritoDOM.innerHTML = '<li>El carrito está vacío. <a href="los_mas_vendidos.html">¡Comienza a comprar!</a></li>';
        totalCarritoDOM.textContent = '0';
        return;
    }

    carrito.forEach(producto => {
        const item = document.createElement('li');
        const subtotal = producto.precio * producto.cantidad;
        
        // Renderizado del ítem con botones de acción
        item.innerHTML = `
            <span class="nombre-producto">${producto.nombre}</span> 
            
            <div style="display: flex; align-items: center;">
                <button class="btn-restar" data-id="${producto.id}" title="Restar unidad">
                    ➖
                </button>
                <strong style="margin: 0 10px;">${producto.cantidad}</strong>
                
                <strong style="margin-right: 25px;">$${subtotal.toLocaleString('es-AR')}</strong>
                
                <button class="btn-eliminar" data-id="${producto.id}" title="Eliminar producto completo">
                    ❌ Eliminar
                </button>
            </div>
        `;
        
        listaCarritoDOM.appendChild(item);
        total += subtotal;
    });

    // Muestra el total formateado
    totalCarritoDOM.textContent = total.toLocaleString('es-AR');
}