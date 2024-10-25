const filterComics = document.getElementById('filter-comics');
const searchButtonComics = document.getElementById('search-button-comics');
const searchInputComics = document.getElementById('search-input-comics');
const searchCharactersToggle = document.getElementById('change-to-characters');
const searchSortComics = document.getElementById('sort-comics');
const comicsContainer = document.getElementById('comics-container');
const comicSpotlight = document.getElementById('comic-spotlight');

const filterCharacters = document.getElementById('filter-characters');
const searchButtonCharacters = document.getElementById('search-button-characters');
const searchInputCharacters = document.getElementById('search-input-characters');
const searchComicsToggle = document.getElementById('change-to-comics');
const searchSortCharacters = document.getElementById('sort-characters');
const charactersContainer = document.getElementById('characters-container');
const characterSpotlight = document.getElementById('character-spotlight');

const loadingAlert = document.getElementById('loading');

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

const root = "http://gateway.marvel.com";
const comicsEndpoint = root + "/v1/public/comics";
const charactersEndpoint = root + "/v1/public/characters";
const publicKey = "74f0cbbf5b058f085a7c652c6030d2a7";
const ts = "frutilla";
const hash = "3eefd85d7a0a3bdaca81076858f93324"; /*ts + clave privada + clave publica */
const authParams = `?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
const limit = 20;
var currentPage = 1;
var totalPages = 1;
var searchType = "comics";
var orderByComics = "title"; //onsaleDate, title, issueNumber
var orderByCharacters = "name"; //name
var lastTitleSearched = "";
var lastNameSearched = "";

/* Función para mostrar cómics*/
async function showComicsContainer() {
  console.log("Cambiando a pantalla comics");

  comicSpotlight.classList.add('hidden');
  characterSpotlight.classList.add('hidden');
  filterCharacters.classList.add('hidden');
  charactersContainer.classList.add('hidden');

  currentPage = 1;
  handleSearchComics();

  filterComics.classList.remove('hidden');
  comicsContainer.classList.remove('hidden');
};

/*Función para mostrar characters*/
async function showCharactersContainer() {
  console.log("Cambiando a pantalla personajes");

  comicSpotlight.classList.add('hidden');
  characterSpotlight.classList.add('hidden');
  filterComics.classList.add('hidden');
  comicsContainer.classList.add('hidden');

  currentPage = 1;
  handleSearchCharacters();

  filterCharacters.classList.remove('hidden');
  charactersContainer.classList.remove('hidden');
}

const searchComics = async (titleStartsWith) => {
  console.log("Buscando comics",titleStartsWith,currentPage);
  const offset = (currentPage - 1) * limit;
  handleLoading(true);
  return await fetch(comicsEndpoint + authParams + "&orderBy=" + orderByComics + "&limit=" + limit + "&offset=" + offset +
    (titleStartsWith ? "&titleStartsWith=" + titleStartsWith : ""), {
    method: "GET"
  })
  .then(promise => promise.json())
  .then(response => {
    if(!response.data || response.data.results.length === 0) {
      currentPage = 0;
      totalPages = 0;
      return [];
    }
    totalPages = Math.ceil(response.data.total / limit);
    return response.data.results;
  })
  .catch(error => console.error('Error fetching comics on page ' + currentPage + ':', error))
  .finally(()=>handleLoading(false));
}

const getComic = async (comicId) => {
  console.log(`Obteniendo comic ${comicId}`);
  handleLoading(true);
  return await fetch(comicsEndpoint + "/" + comicId + authParams, {
    method: "GET"
  })
  .then(promise => promise.json())
  .then(response => response.data.results[0])
  .catch(error => console.error('Error fetching comic ' + comicId + ':', error))
  .finally(() => handleLoading(false));
}

const searchCharacters = async (nameStartsWith) => {
  console.log("Buscando personajes",nameStartsWith,currentPage);
  const offset = (currentPage - 1) * limit;
  handleLoading(true);
  return fetch(charactersEndpoint + authParams + "&orderBy=" + orderByCharacters + "&limit=" + limit + "&offset=" + offset + 
    (nameStartsWith?"&nameStartsWith=" + nameStartsWith : ""), {
    method: "GET"
  })
  .then(promise=>promise.json())
  .then(response=>{
    if(!response.data || response.data.results.length === 0) {
      currentPage = 0;
      totalPages = 0;
      return [];
    }
    totalPages = Math.ceil(response.data.total / limit);
    return response.data.results;
  })
  .catch(error => console.error('Error fetching characters ' + currentPage + ':', error))
  .finally(() => handleLoading(false));
}

const getCharacter = async (characterId) => {
  console.log(`Obteniendo personaje ${characterId}`);
  handleLoading(true);
  return fetch(charactersEndpoint + "/" + characterId + authParams, {
    method: "GET"
  })
  .then(response => response.json())
  .then(response => response.data.results[0])
  .catch(error => console.error('Error fetching character ' + characterId + ':', error))
  .finally(() => handleLoading(false));
}

const showComics = (comics) => {
  comicsContainer.innerHTML = '';

  for(const comic of comics) {
    const comicHTML = `
    <div onclick="handleShowComic(${comic.id})" class="rounded-lg w-60 overflow-hidden text-black transition-transform duration-300 ease-in-out hover:text-red-500 transform hover:scale-105 cursor-pointer">
      <img class="w-auto h-96 object-cover shadow-2xl hover:shadow-2xl transition-transform duration-300 ease-in-out" src="${comic.thumbnail.path.replace('http://', 'https://')}.${comic.thumbnail.extension}">
      <h2 class="mt-8 text-sm font-bold text-center">${comic.title}</h2>
    </div>
    `;
    comicsContainer.insertAdjacentHTML('beforeend', comicHTML);
  }
};

const showCharacters = (characters) => {
  charactersContainer.innerHTML = '';

  for(const character of characters) {
    const characterHTML = `
    <div class="rounded-lg w-60 overflow-hidden text-black transition-transform duration-300 ease-in-out hover:text-red-500 transform hover:scale-105 cursor-pointer" onclick="handleShowCharacter(${character.id})">
      <img class="w-auto h-96 object-cover shadow-2xl hover:shadow-2xl transition-transform duration-300 ease-in-out" src="${character.thumbnail.path.replace('http://', 'https://')}.${character.thumbnail.extension}">
      <h2 class="mt-8 text-sm font-bold text-center">${character.name}</h2>
    </div>
    `;
    charactersContainer.insertAdjacentHTML('beforeend', characterHTML);
  }
};

const showComicSpotlight = async(comic) => {
  comicSpotlight.innerHTML = `
    <div class="bg-white p-4 rounded-lg shadow-lg">
      <img src="${comic.thumbnail.path}.${comic.thumbnail.extension}" alt="${comic.title}" class="w-auto h-96 object-cover mb-4">
      <h2 class="text-xl font-bold">${comic.title}</h2>
      <p><strong>Fecha de lanzamiento:</strong> ${comic.dates[0]?.date.replaceAll("-","/").substring(0,10) || 'No disponible'}</p>
      <p><strong>Creadores:</strong> ${comic.creators.items.map(creator=>creator.name + " (" + creator.role + ")").join(", ") || 'No disponible'}</p>
      <p><strong>Descripción:</strong> ${comic.description || 'No disponible'}</p>
    </div>
  `;
  comicSpotlight.classList.remove('hidden');
};


/*Función para mostrar detalles de un character*/
const showCharacterSpotlight = async(character) => {
  characterSpotlight.innerHTML = `
    <div class="bg-white p-4 rounded-lg shadow-lg">
      <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}" class="w-auto h-96 object-cover mb-4">
      <h2 class="text-xl font-bold">${character.name}</h2>
      <p><strong>Descripción:</strong> ${character.description || 'No disponible'}</p>
      <p><strong>Cómics en los que aparece:</strong> ${character.comics.items.map(comic=>comic.name).join(", ") || 'No disponible'}</p>
    </div>
  `;
  characterSpotlight.classList.remove('hidden');
};

const handleLoading = (isLoading) => {
  if(isLoading) {
    loadingAlert.classList.remove('hidden');
    currentPageDisplay.innerHTML = 'CARGANDO...';
    currentPageBottomDisplay.innerHTML = 'CARGANDO...';
  } else {
    loadingAlert.classList.add('hidden');
    updatePagination();
  }
}

function handleSearchTypeChange(type) {
  searchType = type;
  if (type === 'characters') {
    showCharactersContainer();
  } else {
    showComicsContainer();
  }
}

function handlePageChange() {
  if(searchType == 'characters') {
    handleSearchCharacters();
  } else {
    handleSearchComics();
  }
}

const handleSearchComics = async() => {
  comicSpotlight.classList.add('hidden');
  charactersContainer.classList.add('hidden');
  comicsContainer.classList.remove('hidden');
  const titleStartsWith = searchInputComics.value.trim()
  if(titleStartsWith != lastTitleSearched) {
    currentPage = 1;
    lastTitleSearched = titleStartsWith;
    characterSpotlight.classList.add('hidden');
  }
  const comics = await searchComics(titleStartsWith);
  
  updatePagination();
  showComics(comics);
}

const handleSearchCharacters = async() => {
  characterSpotlight.classList.add('hidden');
  comicsContainer.classList.add('hidden');
  charactersContainer.classList.remove('hidden');
  const nameStartsWith = searchInputCharacters.value.trim();
  if(nameStartsWith != lastNameSearched) {
    currentPage = 1;
    lastNameSearched = nameStartsWith;
    comicSpotlight.classList.add('hidden');
  }

  const characters = await searchCharacters(nameStartsWith);

  updatePagination();
  showCharacters(characters);
}

const handleShowComic = async(comicId) => {
  const comic = await getComic(comicId);
  showComicSpotlight(comic);

  //Get related characters
  comicsContainer.classList.add('hidden');
  characterSpotlight.classList.add('hidden');
  var relCharacters = [];
  for(const relCharacter of comic.characters.items) {
    //La única manera de conseguir los ID de personaje :'(
    characterId = relCharacter.resourceURI.split("characters/")[1];
    relCharacters.push(await getCharacter(characterId));
  }
  if(relCharacters.length === 0) {
    currentPage = 0;
    totalPages = 0;
    updatePagination();
    return;
  }
  currentPage = 1;
  totalPages = Math.ceil(relCharacters.length / limit);
  updatePagination();
  charactersContainer.classList.remove('hidden');
  showCharacters(relCharacters);
}

const handleShowCharacter = async(characterId) => {
  const character = await getCharacter(characterId);
  showCharacterSpotlight(character);

  //Get related comics
  charactersContainer.classList.add('hidden');
  comicSpotlight.classList.add('hidden');
  
  var relComics = [];
  for(const relComic of character.comics.items) {
    //La única manera de conseguir los ID de comic :'(
    comicId = relComic.resourceURI.split("comics/")[1];
    relComics.push(await getComic(comicId));
  }
  if(relComics.length === 0) {
    currentPage = 0;
    totalPages = 0;
    updatePagination();
    return;
  }
  currentPage = 1;
  totalPages = Math.ceil(relComics.length / limit);
  updatePagination();
  comicsContainer.classList.remove('hidden');
  showComics(relComics);
}

const updatePagination = () => {

  currentPageDisplay.innerHTML = `PAGINA ${currentPage} DE ${totalPages}`;
  currentPageBottomDisplay.innerHTML = `PAGINA ${currentPage} DE ${totalPages}`;

  //Pagina 0 para nada encontrado
  if(currentPage === 0) {
    disableButtons([firstPage,prevPage,firstPageBottom,prevPageBottom,nextPage,lastPage,nextPageBottom,lastPageBottom]);
    return;
  }

  if(currentPage === 1) {
    disableButtons([firstPage,prevPage,firstPageBottom,prevPageBottom]);
  } else {
    enableButtons([firstPage,prevPage,firstPageBottom,prevPageBottom]);
  }

  if(currentPage === totalPages) {
    disableButtons([nextPage,lastPage,nextPageBottom,lastPageBottom]);
  } else {
    enableButtons([nextPage,lastPage,nextPageBottom,lastPageBottom]);
  }
};

function enableButtons(buttons) {
  for(const button of buttons) {
    button.disabled = false;
    button.classList.remove("bg-gray-500");
    button.classList.add("bg-black","hover:bg-red-800");
  }
}

function disableButtons(buttons) {
  for(const button of buttons) {
    button.disabled = true;
    button.classList.remove("bg-black","hover:bg-red-800");
    button.classList.add("bg-gray-500");
  }
}

searchButtonComics.addEventListener('click', handleSearchComics);
searchButtonCharacters.addEventListener('click', handleSearchCharacters);

searchInputComics.addEventListener('keypress', (event) => {if(event.key === 'Enter') handleSearchComics()});
searchInputCharacters.addEventListener('keypress', (event) => {if(event.key === 'Enter') handleSearchCharacters()});

searchComicsToggle.addEventListener('click', () => {
  handleSearchTypeChange('comics');
});

searchCharactersToggle.addEventListener('click', () => {
  handleSearchTypeChange('characters');
});

searchSortComics.addEventListener('change', (event) => orderByComics = event.target.value);
searchSortCharacters.addEventListener('change', (event) => orderByCharacters = event.target.value);

firstPage.addEventListener('click', (event) => {
  currentPage = 1;
  handlePageChange();
});

firstPageBottom.addEventListener('click', () => {
  currentPage = 1;
  handlePageChange();
});

prevPage.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    handlePageChange();
  }
});

prevPageBottom.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    handlePageChange();
  }
});

nextPage.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    handlePageChange();
  }
});

nextPageBottom.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    handlePageChange();
  }
});

lastPage.addEventListener('click', () => {
  currentPage = totalPages;
  handlePageChange();
});

lastPageBottom.addEventListener('click', () => {
  currentPage = totalPages;
  handlePageChange();
});

const initializeApp = async () => {
  console.log("Iniciando app");
  showComicsContainer();
};

initializeApp();
