const urlApi = "http://gateway.marvel.com";
const urlPersonajes = "/v1/public/characters";
const publicKey = "74f0cbbf5b058f085a7c652c6030d2a7";
const ts = "frutilla";
const hash ="3eefd85d7a0a3bdaca81076858f93324"; /*ts + clave privada + clave publica */
const paramAutenticacion = `?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

fetch(urlApi + urlPersonajes + paramAutenticacion, {
  method: "GET",
  headers: {
    "Content-type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));



const personajesContainer = document.getElementById('personajes-container');
const comicsContainer = document.getElementById('comic-container');


/*NAVEGACION COMICS - PERSONAJES*/
function mostrarPantallaComics(){
  comicsContainer.classList.remove('hidden');
  personajesContainer.classList.add('hidden');
};


function mostrarPantallaPersonajes(){
comicsContainer.classList.add('hidden');
personajesContainer.classList.remove('hidden');
}



/*Consigo Comics*/
const getComics = () => {
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



/*Busqueda por nombre de comics
searchButton.addEventListener('click', () => {
  const nombrePersonaje = searchInput.value.trim();
  if (nombrePersonaje) {
    buscarPersonajePorNombre(nombrePersonaje);
  } else {
    alert('Por favor, ingresa un nombre de personaje');
  }
});
*/


/*const buscarPersonajePorNombre = (nombre) => {
  const urlPersonaje = `${urlApi}/v1/public/characters?name=${nombre}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;

  fetch(urlPersonaje, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      if (data.data.results.length > 0) {
        const personaje = data.data.results[0];
        const personajeId = personaje.id;
        obtenerComicsPorPersonaje(personajeId);
      } else {
        alert('Personaje no encontrado');
      }
    })
    .catch(error => console.error('Error buscando personaje:', error));
};*/


/*const obtenerComicsPorPersonaje = (personajeId) => {
  const urlComics = `${urlApi}/v1/public/characters/${personajeId}/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=20`;

  fetch(urlComics, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then(response => response.json())
    .then(data => {
      const comics = data.data.results;
      displayComics(comics);
    })
    .catch(error => console.error('Error buscando cómics:', error));
};



Ejemplo de uso de la función, uttilice a Spider-Man 
const characterId = '1009610';
getComicsByCharacter(characterId);
 */


/**/
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('input-search');
const searchType = document.getElementById('search-type');
const searchSort = document.getElementById('search-sort');

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
      
      // Ordenar los cómics
      comics = ordenarResultados(comics, order);
      
      displayComics(comics);  // Mostrar cómics en pantalla
    })
    .catch(error => console.error('Error buscando cómics:', error));
};

/*Personajes por nombre*/
const buscarPersonajesPorNombre = (nombre, order) => {
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

      // Ordenar personajes
      personajes = ordenarResultados(personajes, order);

      displayPersonajes(personajes);  // Mostrar personajes en pantalla
    })
    .catch(error => console.error('Error buscando personajes:', error));
};

/*FILTROS mas nuevos, mas viejos, a-z, z-a*/
const obtenerComics = (orden) => {
  let orderBy = 'title'

  // Establecer el valor de orderBy según la selección del usuario
  if (orden === 'byOlder') {
    orderBy = 'focDate'; // Cambia esto si hay un valor específico para más viejo
  } else if (orden === 'byNewer') {
    orderBy = '-focDate'; // Cambia esto si hay un valor específico para más nuevo
  } else if (orden === 'a-z') {
    orderBy = 'title';
  } else if (orden === 'z-a') {
    orderBy = '-title';
  }

  // Construir la URL con orderBy
  const urlComics = `${urlApi}/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}&orderBy=${orderBy}&limit=20`;

  fetch(urlComics)
    .then(response => response.json())
    .then(data => {
      const comics = data.data.results;
      displayComics(comics);
    })
    .catch(error => console.error('Error fetching comics:', error));
};

const buscarComics = () => {
  const orden = document.getElementById('search-sort').value; // Obtener valor del filtro
  obtenerComics(orden); // Pasar el valor a obtenerComics
};

document.getElementById('search-button').addEventListener('click', buscarComics);



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

const updatePaginationButtons = () => {
  document.getElementById('btn-first-page').disabled = currentPage === 1;
  document.getElementById('btn-prev-page').disabled = currentPage === 1;
  document.getElementById('btn-next-page').disabled = currentPage === totalPages;
  document.getElementById('btn-last-page').disabled = currentPage === totalPages;
  document.getElementById('btn-first-page-bottom').disabled = currentPage === 1;
  document.getElementById('btn-prev-page-bottom').disabled = currentPage === 1;
  document.getElementById('btn-next-page-bottom').disabled = currentPage === totalPages;
  document.getElementById('btn-last-page-bottom').disabled = currentPage === totalPages;
  
  document.getElementById('current-page').textContent = `PÁGINA ${currentPage}`;
  document.getElementById('current-page-bottom').textContent =`PÁGINA ${currentPage}`;
};

/*listeners button páginado*/
document.getElementById('btn-first-page').addEventListener('click', () => {
  currentPage = 1;
  fetchComics(currentPage);
});

document.getElementById('btn-first-page-bottom').addEventListener('click', () => {
  currentPage = 1;
  fetchComics(currentPage);
});



document.getElementById('btn-prev-page').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchComics(currentPage);
  }
});
document.getElementById('btn-prev-page-bottom').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchComics(currentPage);
  }
});



document.getElementById('btn-next-page').addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchComics(currentPage);
  }
});

document.getElementById('btn-next-page-bottom').addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchComics(currentPage);
  }
});



document.getElementById('btn-last-page').addEventListener('click', () => {
  currentPage = totalPages;
  fetchComics(currentPage);
});

document.getElementById('btn-last-page-bottom').addEventListener('click', () => {
  currentPage = totalPages;
  fetchComics(currentPage);
});



/*initialize App*/
const initializeApp = async () => {
  obtenerComics('a-z');
  mostrarPantallaComics();
  await fetchComics(currentPage);
};
initializeApp();




