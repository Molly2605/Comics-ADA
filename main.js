const urlApi = "http://gateway.marvel.com";
const urlPersonajes = "/v1/public/characters";
const publicKey = "74f0cbbf5b058f085a7c652c6030d2a7";
const ts = "frutilla";
const hash = "3eefd85d7a0a3bdaca81076858f93324"; /*ts + clave privada + clave publica */
const paramAutenticacion = `?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
/**
fetch(urlApi + urlPersonajes + paramAutenticacion, {
  method: "GET",
  headers: {
    "Content-type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
 */


const personajesContainer = document.getElementById('personajes-container');
const comicsContainer = document.getElementById('comic-container');
const comicsSection = document.getElementById('comics-section');
const personajeSection = document.getElementById('personaje-section');

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('input-search');
const searchType = document.getElementById('search-type');
const searchSort = document.getElementById('search-sort');

let firstPage = document.getElementById('btn-first-page');
let prevPage = document.getElementById('btn-prev-page');
let nextPage = document.getElementById('btn-next-page');
let lastPage = document.getElementById('btn-last-page');
let firstPageBottom = document.getElementById('btn-first-page-bottom');
let prevPageBottom = document.getElementById('btn-prev-page-bottom');
let nextPageBottom = document.getElementById('btn-next-page-bottom');
let lastPageBottom = document.getElementById('btn-last-page-bottom');
let currentPageDisplay = document.getElementById('current-page');
let currentPageBottomDisplay = document.getElementById('current-page-bottom');


/*NAVEGACION COMICS*/
function mostrarPantallaComics() {
  console.log("Cambiando a pantalla comics");
  comicsContainer.classList.remove('hidden');
  personajesContainer.classList.add('hidden');
  comicsSection.classList.remove('hidden');
  personajeSection.classList.add('hidden');
};

/*NAVEGACION  PERSONAJES*/
function mostrarPantallaPersonajes() {
  console.log("Cambiando a pantalla personajes");
  comicsContainer.classList.add('hidden');
  personajesContainer.classList.remove('hidden');
  comicsSection.classList.add('hidden');
  personajeSection.classList.remove('hidden');
}


/*Consigo Comics*/
const getComics = () => {
  console.log("consigo comics");
  const urlComics = `${urlApi}/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=20`;

  fetch(urlComics, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const comics = data.data.results;
      displayComics(comics);
    })
    .catch((error) => console.error('Error fetching comics:', error));
};

const displayComics = (comics) => {
  console.log("display de comics");
  comicsContainer.innerHTML = '';
  comics.forEach(comic => {
    const comicHTML = `
    <div class="rounded-lg w-60 overflow-hidden text-black transition-transform duration-300 ease-in-out hover:text-red-500 transform hover:scale-105">
  <img class="w-auto h-96 object-cover shadow-2xl hover:shadow-2xl transition-transform duration-300 ease-in-out cursor-pointer" src="${comic.thumbnail.path}.${comic.thumbnail.extension}">
  <h2 class="mt-8 text-sm font-bold text-center">${comic.title}</h2>
</div>

      `;
    comicsContainer.insertAdjacentHTML('beforeend', comicHTML);
  });
};
getComics();



/*Consigo Personajes*/
const getPersonajes = () => {
  console.log("consigo personajes");
  const urlPersonajes = `${urlApi}/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=20`;

  fetch(urlPersonajes, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const personajes = data.data.results;
      displayPersonajes(personajes);
    })
    .catch((error) => console.error('Error fetching personajes:', error));
};

const displayPersonajes = (personajes) => {
  personajesContainer.innerHTML = ''; // Limpiar el contenedor antes de mostrar nuevos resultados

  personajes.forEach(personaje => {
    const personajeHTML = `
    <div class="rounded-lg w-60 overflow-hidden text-black transition-transform duration-300 ease-in-out hover:text-red-500 transform hover:scale-105">
      <img class="w-auto h-96 object-cover shadow-2xl hover:shadow-2xl transition-transform duration-300 ease-in-out cursor-pointer"src="${personaje.thumbnail.path}.${personaje.thumbnail.extension}">
      <h2 class="mt-8 text-sm font-bold text-center">${personaje.name}</h2>
    </div>
    `;
    personajesContainer.insertAdjacentHTML('beforeend', personajeHTML);
  });
};
getPersonajes();





function fetchPersonajes() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const personajes = data.data.results;
      personajesContainer.innerHTML = ''; // Limpia el contenedor
      personajes.forEach(personaje => {
        const personajeCard = `
          <div class="personaje-card">
            <h3>${personaje.name}</h3>
            <img src="${personaje.thumbnail.path}.${personaje.thumbnail.extension}" alt="${personaje.name}" />
          </div>
        `;
        personajesContainer.innerHTML += personajeCard; // Agrega cada personaje al contenedor
      });
    })
    .catch(error => console.error('Error fetching personajes:', error));
}

function handleSearchTypeChange(type) {
  if (type === 'characters') {
    mostrarPantallaPersonajes(); // Llama a la función para mostrar personajes
  } else {
    mostrarPantallaComics(); // Llama a la función para mostrar cómics
  }
}


/*Ejemplo de uso de la función, uttilice a Spider-Man 
const characterId = '1009610';
getComicsByCharacter(characterId);
 */

searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  const type = searchType.value;
  const order = searchSort.value;

  if (query) {
    if (type === 'comics') {
      buscarComicsPorNombre(query, order);
    } else if (type === 'characters') {
      buscarPersonajesPorNombre(query, order);
    }
  } else {
    alert('Por favor, ingresa un nombre para buscar');
  }
});


/*Comics por nombre*/
const buscarComicsPorNombre = (nombre, order) => {
  console.log("buscar comics por nombre");
  let urlComics = `${urlApi}/v1/public/comics?titleStartsWith=${nombre}&ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=20`;

  fetch(urlComics, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then(response => response.json())
    .then(data => {
      let comics = data.data.results;

      comics = ordenarResultados(comics, order);

      displayComics(comics);
    })
    .catch(error => console.error('Error buscando cómics:', error));
};

// Función para ordenar los resultados
const ordenarResultados = (comics, order) => {
  console.log("ordenar resultados");
  if (order === 'title') {
    return comics.sort((a, b) => a.title.localeCompare(b.title));
  } else if (order === 'modified') {
    return comics.sort((a, b) => new Date(b.modified) - new Date(a.modified));
  }

  return comics;
};


/*Personajes por nombre*/
const buscarPersonajesPorNombre = (nombre, order) => {
  console.log("buscar personajes por nombre");
  let urlPersonajes = `${urlApi}/v1/public/characters?nameStartsWith=${nombre}&ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=20`;

  fetch(urlPersonajes, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then(response => response.json())
    .then(data => {
      let personajes = data.data.results;
      personajes = ordenarResultados(personajes, order);
      displayPersonajes(personajes);
    })
    .catch(error => console.error('Error buscando personajes:', error));
};



/*FILTROS mas nuevos, mas viejos, a-z, z-a*/
const filtroComics = (orden) => {
  console.log("filtros de los comics");
  let orderBy = 'title'
  if (orden === 'byOlder') {
    orderBy = 'focDate';
  } else if (orden === 'byNewer') {
    orderBy = '-focDate';
  } else if (orden === 'a-z') {
    orderBy = 'title';
  } else if (orden === 'z-a') {
    orderBy = '-title';
  }


  const urlComics = `${urlApi}/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}&orderBy=${orderBy}&limit=20`;
  fetch(urlComics)
    .then(response => response.json())
    .then(data => {
      const comics = data.data.results;
      displayComics(comics);
    })
    .catch(error => console.error('Error fetching comics:', error));
};


/*Buttons navegación de páginas*/
let currentPage = 1;
let totalPages = 0;
const limit = 20;

const fetchComics = async (page) => {
  const offset = (page - 1) * limit;
  const urlComics = `${urlApi}/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`;

  try {
    const response = await fetch(urlComics);
    if (!response.ok) {
      throw new Error('Error al obtener cómics');
    }

    const data = await response.json();
    totalPages = Math.ceil(data.data.total / limit);
    displayComics(data.data.results);
    updatePaginationButtons();
  } catch (error) {
    console.error('Error al obtener cómics:', error);
  }
};

/*let firstPage = false; 
let prevPage = false;
let nextPage = false;
let lastPage = false;
let firstPageBottom = false;
let prevPageBottom = false;
let nextPageBottom = false;
let lastPageBottom = false;*/

const updatePaginationButtons = () => {
  firstPage = currentPage === 1;
  prevPage = currentPage === 1;
  nextPage = currentPage === totalPages;
  lastPage = currentPage === totalPages;
  firstPageBottom = currentPage === 1;
  prevPageBottom = currentPage === 1;
  nextPageBottom = currentPage === totalPages;
  lastPageBottom = currentPage === totalPages;

  currentPageDisplay = `PÁGINA ${currentPage}`;
  currentPageBottomDisplay = `PÁGINA ${currentPage}`;
};


/*listeners button páginado*/
firstPage.addEventListener('click', () => {
  currentPage = 1;
  fetchComics(currentPage);
});

firstPageBottom.addEventListener('click', () => {
  currentPage = 1;
  fetchComics(currentPage);
});



prevPage.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchComics(currentPage);
  }
});
prevPageBottom.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchComics(currentPage);
  }
});



nextPage.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchComics(currentPage);
  }
});

nextPageBottom.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchComics(currentPage);
  }
});



lastPage.addEventListener('click', () => {
  currentPage = totalPages;
  fetchComics(currentPage);
});

lastPageBottom.addEventListener('click', () => {
  currentPage = totalPages;
  fetchComics(currentPage);
});



/*initialize App*/
const initializeApp = async () => {
  console.log("Iniciando app")
  filtroComics('a-z');
  mostrarPantallaComics();
  await fetchComics(currentPage);
};

initializeApp();
