const starEmpty = "☆";
const starFull = "★";
const form = document.querySelector("#user-input");

form.addEventListener("submit", (event) =>{
    event.preventDefault();
    const city = event.target["city-input"].value.toLowerCase();

    fetch(`https://api.openbrewerydb.org/breweries?by_city=${city}`)
    .then(response => response.json())
    .then(breweries => {
    console.log(breweries);
    document.querySelector('#brewery-cards').innerHTML = "";
    breweries.forEach(brewery => renderCard(brewery));        
    });
})

function renderCard(brewery) {
    const cardsSection = document.querySelector('#brewery-cards')

    const divCard = document.createElement('div');

    const breweryName = document.createElement('h2');
    breweryName.classList.add('name');
    breweryName.textContent = brewery.name;
    divCard.append(breweryName);

    const rating = document.createElement('div');
    rating.classList.add('rating');
    for(let i = 0; i < 5; i++){
        const ratingButton = document.createElement('button');
        ratingButton.classList.add(`button-${i+1}`);
        ratingButton.textContent = starEmpty;
        ratingButton.addEventListener('click', (event) => ratingButtonClickHandler(event));
        rating.append(ratingButton);
    }
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

    //console.log(typeof brewery.website_url)
    if (brewery.website_url){
        const breweryWebsite = document.createElement('a'); 
        breweryWebsite.href = brewery.website_url;
        breweryWebsite.textContent = "website"
        divCard.append(breweryWebsite)
    };
    
    cardsSection.append(divCard);
}

function ratingButtonClickHandler(event) {
    let current = event.target;
    let prevSibling = current.previousElementSibling;

    current.textContent = starFull;
    while(prevSibling) {
        prevSibling.textContent = starFull;
        current = prevSibling;
        prevSibling = current.previousElementSibling;
    }

    current = event.target;
    let nextSibling = current.nextElementSibling
    while(nextSibling) {
        nextSibling.textContent = starEmpty;
        current = nextSibling;
        nextSibling = current.nextElementSibling;
    }
}

btn = document.querySelector("#party-button")
btn.addEventListener("click", ()=>{
    const img = document.createElement("img")
    
    img.src="https://c.tenor.com/_4YgA77ExHEAAAAC/rick-roll.gif"
    alert("21+ ONLY!!!!")
})