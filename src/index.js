const starEmpty = "☆";
const starFull = "★";

function init() {
    fetch('https://api.openbrewerydb.org/breweries')
    .then(response => response.json())
    .then(breweries => {
        console.log(breweries);
        breweries.forEach(brewery => renderCard(brewery)); 
    });

    const form = document.querySelector("#user-input");

    form.addEventListener("submit", (event) =>{
        event.preventDefault();
        const city = event.target["city-input"].value.toLowerCase();
        console.log(city);

        fetch(`https://api.openbrewerydb.org/breweries?by_city=${city}`)
        .then(response => response.json())
        .then(breweries => {
        console.log(breweries);
        document.querySelector('#brewery-cards').innerHTML = "";
        breweries.forEach(brewery => renderCard(brewery));        
        });
    })
}

function renderCard(brewery) {
    const cardsSection = document.querySelector('#brewery-cards')

    const divCard = document.createElement('div');

    const breweryName = document.createElement('h2');
    breweryName.classList.add('name');
    breweryName.textContent = brewery.name;
    divCard.append(breweryName);

    const rating = document.createElement('button');
    rating.classList.add('rating');
    rating.textContent = "☆☆☆☆☆";
    divCard.append(rating);

    const breweryStreet = document.createElement('p');
    breweryStreet.classList.add('street');
    breweryStreet.textContent = brewery.street;
    divCard.append(breweryStreet);

    const breweryCityState = document.createElement('p');
    breweryCityState.classList.add('city-state');
    breweryCityState.textContent = `${brewery.city}, ${brewery.state}`;
    divCard.append(breweryCityState);

    const breweryPhone = document.createElement('p');
    breweryPhone.classList.add('phone');
    breweryPhone.textContent = brewery.phone;
    divCard.append(breweryPhone);

    cardsSection.append(divCard);
}

init();