document.addEventListener("DOMContentLoaded", function() {
    // Cargar datos de productos
    cargarDatos();

    // Agregar eventos para la medición y nueva medición
    document.getElementById('measurementForm').addEventListener('submit', function(event) {
        event.preventDefault();
        realizarMedicion();
    });

    document.getElementById('newMeasurementButton').addEventListener('click', function(event) {
        event.preventDefault();
        realizarNuevaMedicion();
    });
});

// Variables y funciones relacionadas con las mediciones
function realizarMedicion() {
    const form = document.getElementById('measurementForm');
    const resultDiv = document.getElementById('result');
    const submitButton = document.getElementById('submitButton');
    const measurementCard = document.getElementById('measurementCard');
    const bpmSpan = document.getElementById('bpm');
    const spo2Span = document.getElementById('spo2');

    // Cambiar el botón a estado de cargando
    submitButton.innerHTML = `
        <svg aria-hidden="true" class="inline-block w-5 h-5 mr-3 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="inline-block">Cargando...</span>
    `;
    submitButton.disabled = true;

    // Realizar la solicitud AJAX
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/mediciones/medir', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            submitButton.innerHTML = 'Obtener Medición';
            submitButton.disabled = false;

            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    bpmSpan.innerHTML = response.hr;
                    spo2Span.innerHTML = response.spo2;
                    form.classList.add('hidden');
                    measurementCard.classList.remove('hidden');
                } else {
                    alert('Error al obtener el valor del sensor');
                    resultDiv.innerHTML = '<p class="text-xl font-semibold mb-3 text-red-500">Error al obtener el valor del sensor</p>';
                }
            } else {
                alert('Error al realizar la solicitud');
                resultDiv.innerHTML = '<p class="text-xl font-semibold mb-3 text-red-500">Error al realizar la solicitud</p>';
            }
        }
    };
    xhr.send('message=medir');
}

function realizarNuevaMedicion() {
    const values = document.querySelectorAll('.value');

    // Cambiar valores a estado de cargando
    values.forEach(function(value) {
        value.innerHTML = `
            <svg aria-hidden="true" class="inline-block w-5 h-5 mr-3 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
        `;
    });

    // Realizar la solicitud AJAX
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'mediciones/medir', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    // Actualizar los valores de bpm y spo2 en el DOM
                    const bpmSpan = document.getElementById('bpm');
                    const spo2Span = document.getElementById('spo2');
                    bpmSpan.innerHTML = response.hr;
                    spo2Span.innerHTML = response.spo2;
                } else {
                    alert('Error al obtener el valor del sensor');
                }
            } else {
                alert('Error al realizar la solicitud');
            }
        }
    };
    xhr.send('message=medir');
}

// Variables y funciones relacionadas con la tabla de productos, paginación y búsqueda
let productos = []; // Variable para almacenar los datos de los productos
let productosMostrados = []; // Variable para almacenar los productos mostrados actualmente
let resultadosPorPagina = 5; // Número de productos por página
let paginaActual = 1; // Página actual de la paginación

function cargarDatos() {
  fetch('/mediciones/historial/datos')
      .then(response => response.json())
      .then(data => {
          console.log(data);
          productos = data.mediciones; // Almacenar los datos en la variable productos
          actualizarProductosMostrados();
          mostrarProductos();
          activarPaginacion();
      })
      .catch(error => console.error('Error al cargar los datos:', error));
}


function mostrarProductos() {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';

  productosMostrados1.forEach(producto => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">${producto.bpm}</td>
      <td class="px-6 py-4 whitespace-nowrap">${producto.spo2}</td>
      <td class="px-6 py-4 whitespace-nowrap">${producto.hora}</td>
      <td class="px-6 py-4 whitespace-nowrap">${producto.fecha}</td>
      <td class="px-6 py-4 whitespace-nowrap"><a href="#" class="text-blue-600 hover:underline">Editar</a></td>
    `;
    tableBody.appendChild(row);
  });
}

function actualizarProductosMostrados() {
  const inicio = (paginaActual1 - 1) * resultadosPorPagina1;
  const fin = inicio + resultadosPorPagina1;
  productosMostrados1 = productos.slice(inicio, fin);
}

function activarPaginacion() {
  const paginas = Math.ceil(productos.length / resultadosPorPagina1);

  const paginacion = document.getElementById('paginacion');
  paginacion.innerHTML = '';

  for (let i = 1; i <= paginas; i++) {
    const boton = document.createElement('button');
    boton.textContent = i;
    boton.className = 'pagination-btn min-w-[2.5rem] h-[2.5rem] m-1 bg-blue-700 text-white border border-transparent ';
    if (i === paginaActual1) {
      boton.classList.add('bg-blue-900');
    }
    boton.addEventListener('click', () => {
      paginaActual1 = i;
      actualizarProductosMostrados();
      mostrarProductos();
      actualizarBotonesPaginacion();
    });
    paginacion.appendChild(boton);
  }
}

function actualizarBotonesPaginacion() {
  const botonesPaginacion = document.querySelectorAll('.pagination-btn');
  botonesPaginacion.forEach(btn => {
    const numeroPagina = parseInt(btn.textContent);
    if (numeroPagina === paginaActual1) {
      btn.classList.add('bg-blue-900');
    } else {
      btn.classList.remove('bg-blue-900');
    }
  });
}

function activarBusqueda() {
  const inputBusqueda = document.createElement('input');
  inputBusqueda.setAttribute('type', 'text');
  inputBusqueda.setAttribute('placeholder', 'Buscar...');
  inputBusqueda.className = 'px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500';
  inputBusqueda.addEventListener('input', () => {
    const valorBusqueda = inputBusqueda.value.toLowerCase().trim();
    const productosFiltrados = productos.filter(producto =>
      producto.productName.toLowerCase().includes(valorBusqueda) ||
      producto.color.toLowerCase().includes(valorBusqueda) ||
      producto.category.toLowerCase().includes(valorBusqueda) ||
      producto.price.toLowerCase().includes(valorBusqueda)
    );
    productos = productosFiltrados; // Actualizar la lista de productos filtrados
    paginaActual1 = 1; // Volver a la primera página al realizar una búsqueda
    actualizarProductosMostrados();
    mostrarProductos();
    activarPaginacion();
  });

  const contenedor = document.querySelector('.tabla-scroll');
  contenedor.insertBefore(inputBusqueda, contenedor.firstChild);
}

function ordenarColumna(index) {
  const tipoDato = typeof productos[0][Object.keys(productos[0])[index]];

  productos.sort((a, b) => {
    let valorA = a[Object.keys(a)[index]];
    let valorB = b[Object.keys(b)[index]];

    if (tipoDato === 'string') {
      valorA = valorA.toLowerCase();
      valorB = valorB.toLowerCase();
    }

    if (valorA < valorB) return -1;
    if (valorA > valorB) return 1;
    return 0;
  });

  actualizarProductosMostrados();
  mostrarProductos();
  activarPaginacion();
}
