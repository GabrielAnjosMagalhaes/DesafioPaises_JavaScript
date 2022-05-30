//Variáveis de estado (no momento global)
//Definirão em qual aba estamos trabalhando
let tabCountries = null;
let tabFavorites = null;

//Arrays que conterão as listas de países
let allCountries = [];
let favoriteCountries = [];

//Conterão o total de países
let countCountries = 0;
let countFavorites = 0;

//Acumularão a soma das populações de cada lista
let totalPopulationList = 0;
let totalPopulationFavorites = 0;

//Servirá para formatar números
let numberFormat = null;


window.addEventListener('load', () => {

  //Mapeamento do dom
  tabCountries = document.querySelector('#tabCountries');
  countCountries = document.querySelector('#countCountries');

  tabFavorites = document.querySelector('#tabFavorites');
  countFavorites = document.querySelector('#countFavorites');

  totalPopulationList = document.querySelector('#totalPopulationList');
  totalPopulationFavorites = document.querySelector('#totalPopulationFavorites');

  //Formatação de numbers
  numberFormat = Intl.NumberFormat('pt-BR');

  //Invocação
  fetchCountries();

});

async function fetchCountries() {
  const response = await fetch('https://restcountries.com/v2/all');
  const json = await response.json();

  //console.log(json);

  //transformação dos dados para obter apenas id,name,population,flag
  allCountries = json.map(country => {

    //destructuring para simplificar a atribuição a constantes
    const { numericCode, translations, population, flag, region } = country;

    return {
      id: numericCode,
      name: translations.br, //ainda é um objeto que precisei acesar .br
      population,
      formattedPopulation: formatNumber(population),
      flag,
      region
    }
    
  });
  allbkp = allCountries
  render();
}

function render() {
  //Iremos renderizar: countryList, favoritesList, 
  //summary(totais população e páises) e buttons para add e del

  renderCountryList();
  renderFavoritesList();
  renderSummary();
  handleCountryButtons();
}

function renderCountryList() {
  let countriesHTML = "<div>";

  allCountries.forEach(country => {
    const { id, name, flag, formattedPopulation } = country;

    const countryHTML = `
      <div class='country'>
        <div>
          <a id="${id}" class="waves-effect waves-light btn"> + </a>
        </div>
  
        <div>
          <img src="${flag}" alt="${name}"/>
        </div>
      
        <div>
          <ul> 
            <li> ${name} </li>
            <li> ${formattedPopulation} </li>
          </ul>
        </div>
      </div>
    `;

    countriesHTML += countryHTML;
  });

  countriesHTML += '</div>';
  tabCountries.innerHTML = countriesHTML;
}

function renderFavoritesList() {
  let favoritesListHtml = "<div>";

  favoriteCountries.forEach(country => {
    const { id, name, formattedPopulation, flag } = country;

    const favoriteCountryHTML = `
      <div class='country'>
        <div>
          <a id="${id}" class="waves-effect waves-light btn red darken-4"> - </a>
        </div>

        <div>
          <img src="${flag}" alt="${name}"/>
        </div>
      
        <div>
          <ul> 
            <li> ${name} </li>
            <li> ${formattedPopulation} </li>
          </ul>
        </div>
      </div>
    `;
    favoritesListHtml += favoriteCountryHTML;
  });

  favoritesListHtml = favoritesListHtml + '</div>';
  tabFavorites.innerHTML = favoritesListHtml;
}

function renderSummary() {

  //Altera o texto adicionando a quantidade de países
  countCountries.textContent = allCountries.length;
  //countFavorites.textContent = favoriteCountries.length;

  //Faz um somatório da população de todos os países
  const totalPopulation = allCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);

  totalPopulationList.textContent = formatNumber(totalPopulation);

  //Faz um somatório da população dos países favoritos
  const totalFavorites = favoriteCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);

  totalPopulationFavorites.textContent = formatNumber(totalFavorites);

}

function handleCountryButtons() {
  const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));
  const favoriteButtons = Array.from(tabFavorites.querySelectorAll('.btn'));

  //Percorre cada um dos botões colocando o event click para que 
  //ao clicar seja chamada a função addToFavorites que passa o id do 
  //país
  countryButtons.forEach(button => {
    button.addEventListener('click', () => addToFavorites(button.id));
  });

  favoriteButtons.forEach(button => {
    button.addEventListener('click', () => removeFromFavorites(button.id));
  });

}

function addToFavorites(id) {
  //Captura dados do país a ser adicionado
  const countryToAdd = allCountries.find(country => country.id === id);

  //Adicionar à lista de favoritos
  favoriteCountries = [...favoriteCountries, countryToAdd];

  //Coloca a lista de favoritos em ordem alfabética
  favoriteCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  //Remover da lista de países
  allCountries = allCountries.filter(country => country.id !== id);

  //Renderizamos novamente e vemos que agora reflete a mudança de lista
  render();

}

function removeFromFavorites(id) {
  //Captura dados do país a ser removido
  const countryToRemove = favoriteCountries.find(country => country.id === id);

  //Adicionar à lista de países
  allCountries = [...allCountries, countryToRemove];

  //Coloca a lista de países em ordem alfabética
  allCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  //Remover da lista de países
  favoriteCountries = favoriteCountries.filter(country => country.id !== id);

  //Renderizamos novamente e vemos que agora reflete a mudança de lista
  render();
}

function formatNumber(number) {
  return numberFormat.format(number);
}

function pesquisar(){
 var pesquisado = document.getElementById("procurar")
 var pesquisadotexto = pesquisado.value
 if(pesquisadotexto == ""){
  alert("Por favor escreva um nome válido!")
 }else{
  allCountries = allbkp.filter(country => country.name == pesquisadotexto);
  render()
 }

}
  
// botões separação continente

// Buscando continente Asia
function Asia(){
allCountries = allbkp.filter(country => country.region === "Asia");
render()

}

// Buscando continente Europa
function Europa(){
  allCountries = allbkp.filter(country => country.region === "Europe");
  render()
  
}

// Buscando continente Africa
function Africa(){
  allCountries = allbkp.filter(country => country.region === "Africa");
  render()

}

// Buscando continente Oceania
function Oceania(){
  
  allCountries = allbkp.filter(country => country.region === "Oceania");
  render()
}

// Buscando continente Americas
function Americas(){
  allCountries = allbkp.filter(country => country.region === "Americas");
  render()
}

// Buscando continente Polar
function Polar(){
  allCountries = allbkp.filter(country => country.region === "Polar");
  render()
  
}

// Buscando continente OceanoAntartico
function OceanoAntartico(){
  allCountries = allbkp.filter(country => country.region === "Antarctic Ocean");
  render()
 
}

