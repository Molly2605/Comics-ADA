const urlApi = "http://gateway.marvel.com";
const urlPersonajes = "/v1/public/characters";
const publicKey = "74f0cbbf5b058f085a7c652c6030d2a7";
const ts = "frutilla";
const paramAutenticacion = `?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

fetch(urlApi + urlPersonajes + paramAutenticacion, {
  method: "GET",
  headers: {
    /*Authorization: `${apikey}`*/
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
      `http://gateway.marvel.com/v1/public/comics/${comic_id}?ts=IronMan&apikey=8ee98a11040bfc2d1f1afb84440bd188&hash=fec794b59ea963cc0cb95c1cfeedf477`,
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
  }}
