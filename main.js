const urlApi = "http://gateway.marvel.com";
//console.log(apiUrl);
const urlPersonajes = "/v1/public/characters";
//console.log(url);
const publicKey = "74f0cbbf5b058f085a7c652c6030d2a7";
const ts = "frutilla";
const hash = "3eefd85d7a0a3bdaca81076858f93324"; /*ts + clave privada + clave publica */
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
