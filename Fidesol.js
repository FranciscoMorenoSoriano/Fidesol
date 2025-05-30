
function crearTarjetaPais(paises) {
  const tarjetapaises = document.getElementById("resultados");
  tarjetapaises.innerHTML = '';

  paises.map(pais => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");

    const foto = document.createElement("img");
    foto.src = pais.flags.png;
    foto.alt = `Bandera de ${pais.name.common}`;

    const infoContainer = document.createElement("div");
    infoContainer.classList.add("pais-info");

    const nombre = document.createElement("h3");
    nombre.textContent = pais.name.common;

    const poblacion = document.createElement("p");
    poblacion.textContent = `Población: ${pais.population.toLocaleString()}`;

    const capital = document.createElement("p");
    capital.textContent = `Capital: ${pais.capital}`;

    const idioma = document.createElement("p");
    idioma.textContent = pais.languages ?
      `Idioma principal: ${Object.values(pais.languages)[0]}` :
      `Idioma principal: No disponible`;

    infoContainer.appendChild(nombre);
    infoContainer.appendChild(poblacion);
    infoContainer.appendChild(capital);
    infoContainer.appendChild(idioma);

    tarjeta.appendChild(foto);
    tarjeta.appendChild(infoContainer);
    tarjetapaises.appendChild(tarjeta);
  });
}
async function peticion() {
  const datos = await fetch("https://restcountries.com/v3.1/all");
  const paises = await datos.json();
  return(paises)
}


async function mostrarTodo() {
  try {
    const paises =await peticion()
    console.log(paises)
    crearTarjetaPais(paises);
  } catch (error) {
    document.getElementById("resultados").innerHTML =
      '<div class="error">Error al cargar los países</div>';
  }
}

//vamos a hacer una funcion que me saque como objetos del select de continentes los continentes de todos los paises y los vamos a guardar en un array
async function continentes() {
  const continentes = await peticion();
  const continentesUnicos = [...new Set(continentes.map(pais => pais.region))];
  //el select de continentes se llama Continentes
  const selectContinentes = document.getElementById('Continentes');
  selectContinentes.innerHTML = '<option value="default" disabled selected>Selecciona un continente</option>';
  continentesUnicos.forEach(continente => {
    const option = document.createElement('option');
    option.value = continente;
    option.textContent = continente;
    selectContinentes.appendChild(option);
  });
}
//vamos a hacer una funcion que busque por nombre, region, idioma o poblacion utilizando la funcion peticion
async function buscador() {
  const busqueda = document.getElementById('buscador').value.toLowerCase();
  const tipoBusqueda = document.getElementById('tipoBusqueda').value;
  let paises = await peticion();

  if (tipoBusqueda === "1") {
    paises = paises.filter(pais => pais.name.common.toLowerCase().includes(busqueda));
  }
  else if (tipoBusqueda === "2") {
    paises = paises.filter(pais => pais.region.toLowerCase().includes(busqueda));
  }
  else if (tipoBusqueda === "3") {
    paises = paises.filter(pais => {
      return pais.languages && Object.values(pais.languages).some(idioma =>
        idioma.toLowerCase().includes(busqueda));
    });
  }
  else if (tipoBusqueda === "4") {
    const poblacion = parseInt(busqueda);
    if (!isNaN(poblacion)) {
      paises = paises.filter(pais => pais.population >= poblacion);
    }
  }
  else if (tipoBusqueda === "5") {
    const poblacion = parseInt(busqueda);
    if (!isNaN(poblacion)) {
      paises = paises.filter(pais => pais.population <= poblacion);
    }
  }

  crearTarjetaPais(paises); // Añadimos esta línea para mostrar los resultados
}





function ocultarDivs(){
  const busqueda = document.getElementById('tipoBusqueda');
  document.getElementById('BuscadorDefault').style.display = 'none';
  document.getElementById('Buscador1').style.display = 'none';
  document.getElementById('Buscador2').style.display = 'none';
  document.getElementById('Buscador3').style.display = 'none';
  document.getElementById('Buscador4').style.display = 'none';
  document.getElementById('Buscador5').style.display = 'none';

  if (busqueda.value === "1") {
    console.log("hola");
    document.getElementById('Buscador1').style.display = 'block';
  }
  else if (busqueda.value === "2"){
    document.getElementById('Buscador2').style.display = 'block';
  }
  else if (busqueda.value === "3"){
    document.getElementById('Buscador3').style.display = 'block';
  }
  else if (busqueda.value === "4"){
    document.getElementById('Buscador4').style.display = 'block';
  }
  else if (busqueda.value === "5"){
    document.getElementById('Buscador5').style.display = 'block';
  }
  else {
    document.getElementById('BuscadorDefault').style.display = 'block';
  }
}


document.addEventListener('DOMContentLoaded', () => {
  // Cargar los continentes al iniciar
  continentes();
  mostrarTodo();
  //document.getElementById('mostrarTodoBtn').addEventListener('click', mostrarTodo);
  document.getElementById('tipoBusqueda').addEventListener('click', ocultarDivs);

  let tiempoEspera;
  document.getElementById('buscador').addEventListener('input', () => {
    clearTimeout(tiempoEspera);
    tiempoEspera = setTimeout(buscador, 500);
  });
  document.getElementById('mostrarTodoBtn').addEventListener('click', () => {
    mostrarTodo();
    document.getElementById('tipoBusqueda').value = 'default';
    document.getElementById('Continentes').value = 'default';

    ocultarDivs();
  });

ocultarDivs();

  document.getElementById('Continentes').addEventListener('change', async () => {
    const continenteSeleccionado = document.getElementById('Continentes').value;
    let paises = await peticion();
    if (continenteSeleccionado !== 'default') {
      paises = paises.filter(pais => pais.region === continenteSeleccionado);
    }
    crearTarjetaPais(paises);
  });

});

const estilos = `
   <style>
    #resultados {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    padding: 20px;
    background-color: white;
}

.tarjeta {
    background: linear-gradient(135deg, #FF6B6B, #FF8E53);
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    overflow: hidden;
    border: none;
    transition: all 0.4s ease;
    cursor: pointer;
}

.tarjeta img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
}

.pais-info {
    padding: 20px;
    background: rgba(255, 255, 255, 0.95);
    transition: all 0.3s ease;
}

.pais-info h3 {
    margin: 0 0 12px 0;
    color: #2d3748;
    font-size: 20px;
    font-weight: 600;
}

.pais-info p {
    margin: 8px 0;
    color: #4a5568;
    font-size: 15px;
    line-height: 1.5;
}

.tarjeta:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 20px rgba(255, 107, 107, 0.4);
    background: linear-gradient(135deg, #FF8E53, #FF6B6B);
}

.tarjeta:hover .pais-info {
    background: rgba(255, 255, 255, 0.98);
}

.tarjeta:hover img {
    transform: scale(1.08);
}

.tarjeta:hover .pais-info h3 {
    color: #FF6B6B;
}

.tarjeta:hover .pais-info p {
    color: #FF8E53;
}

.loading {
    text-align: center;
    padding: 20px;
    color: #666;
}

.error {
    text-align: center;
    padding: 20px;
    color: #dc3545;
}



    </style>

`;

// Agregar estilos al
document.head.insertAdjacentHTML('beforeend', estilos);



