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

const response = [
  {
    title: "The Incredible Hulk",
    year: 2008,
    rating: [{ name: "Hulk" }],
  },
];

fetch(urlApi + urlPersonajes + paramAutenticacion, {
  method: "GET",
  headers: {
    "Content-type": "application/json",
  },
})
  .then((response) => response.json())
  .then((info) => {
    data_personaje = info.data.results;
    return infoPersonaje(data_personaje);
  })
  .catch((error) => console.error(error));

function infoPersonaje(data_personaje) {
  function infoComic(comic_id) {
    fetch(
      `${urlApi}/v1/public/comics/${comic_id}?ts=IronMan&apikey=${publicKey}&hash=${hash}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((info) => {
        console.log(info.data.results);
      })
      .catch((error) => console.error(error));
  }
}




let resource = "comics" || "characters";
let limit = 20;
let title = "";
let characterName = "";
let offset = 0;
const resultsPerPage = 20;
let currentPage = 1
let totalPages = 1;
let detailCharacter;

const getSearchParameters = () => {
  return {
    searchTerm: $("#input-search").value,
    typeSelected: $("#search-type").value,
    searchSort: $("#search-sort").value,
  };
};

//Hide options select
const manageOptions = () => {
  if ($("#search-type").value === "characters") {
    hideElement(["#byNewer", "#byOlder"])
  } else {
    showElement(["#a-z", "#z-a", "#byNewer", "#byOlder"])
  }
}


const updateDisabledProperty = () => {

  if (offset > 0) {
    $("#btn-prev-page").disabled = false;
    $("#btn-first-page").disabled = false;
  } else {
    $("#btn-prev-page").disabled = true;
    $("#btn-first-page").disabled = true;
  }

  if (offset < (totalPages - 1) * resultsPerPage) {
    $("#btn-next-page").disabled = false;
    $("#btn-last-page").disabled = false;
  } else {
    $("#btn-next-page").disabled = true;
    $("#btn-last-page").disabled = true;
  }
};

const initializeApp = async () => {
  await renderApiResults("comics", "", "a-z", 20, 0);
  await renderTotalResults("comics", "", "a-z", 20, 0);
  updateDisabledProperty();
  //Events
  //Btn search
  $("search-button").addEventListener("click", searchFunction);
}


const resultsContainer = document.getElementById('results'); // Contenedor de resultados de búsqueda
const comicsContainer = document.getElementById(' comics-container'); // Contenedor de cómics

//funciones de navegacion
function mostrarComics() {
  comicsContainer.classList.remove('hidden');
  }
  

// Función para buscar personajes
async function searchCharacters(name) {
  const url = `${urlApi}/v1/public/characters?nameStartsWith=${name}&ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayCharacters(data.data.results); // Mostrar resultados
  } catch (error) {
    console.error('Error fetching characters:', error);
  }
}

// Mostrar personajes en la página
function displayCharacters(characters) {
  resultsContainer.innerHTML = ''; // Limpiar resultados anteriores
  characters.forEach(character => {
    const characterElement = document.createElement('div');
    characterElement.classList.add('character');
    characterElement.textContent = character.name;
    characterElement.addEventListener('click', () => showComics(character.id)); // Click para mostrar cómics
    resultsContainer.appendChild(characterElement);
  });
}

// Función para mostrar los cómics de un personaje específico
async function showComics(characterId) {
  const url = `${urlApi}/v1/public/characters/${characterId}/comics?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data)
    displayComics(data.data.results); // Mostrar cómics
  } catch (error) {
    console.error('Error fetching comics:', error);
  }
}

// Mostrar cómics en la página
function displayComics(comics) {
  comicsContainer.innerHTML = ''; // Limpiar cómics anteriores
  comics.forEach(comic => {
    const comicElement = document.createElement('div');
    comicElement.classList.add('comic');
    comicElement.innerHTML = `
      <img src="${comic.thumbnail.path}.${comic.thumbnail.extension}" alt="${comic.title}" />
      <h3>${comic.title}</h3>
    `;
    comicsContainer.appendChild(comicElement);
  });
}
