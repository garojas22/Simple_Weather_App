import "bootstrap";
import "./style.css";

// Seleccionamos los elementos del DOM
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

const apiKey = "4d8fb5b93d4af21d66a2948710284366";

// Agregamos el evento 'submit' al formulario
form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  // Comprobamos si ya hay ciudades en la lista
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    // Filtramos los elementos de la lista para verificar si la ciudad ya existe
    const filteredArray = listItemsArray.filter(el => {
      let content = "";
      if (inputVal.includes(",")) {
        // Si el inputVal contiene una coma, comprobamos solo el nombre de la ciudad
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          // Si el inputVal contiene una coma pero también un código de país válido, comprobamos ambos
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        // Si no hay coma en el inputVal, comprobamos solo el nombre de la ciudad
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      // Si la ciudad ya existe en la lista, mostramos un mensaje y reiniciamos el formulario
      msg.textContent = `Ya sabes el tiempo para ${
        filteredArray[0].querySelector(".city-name span").textContent
      } ...de lo contrario, sea más específico proporcionando también el código del país 😉`;
      form.reset();
      input.focus();
      return;
    }
  }

  // Hacemos la solicitud a la API
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { main, name, sys, weather } = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;

      // Creamos un nuevo elemento de lista para mostrar los datos obtenidos de la API
      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
        weather[0]["description"]
      }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
      li.innerHTML = markup;
      list.appendChild(li);
    })
    .catch(() => {
      // Si se produce un error en la solicitud, mostramos un mensaje
      msg.textContent = "Por favor busque una ciudad válida 😩";
    });

  // Reiniciamos el mensaje y el formulario
  msg.textContent = "";
  form.reset();
  input.focus();
});
