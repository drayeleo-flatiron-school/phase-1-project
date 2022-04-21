const starEmpty = "☆";
const starFull = "★";
let ratingsJson = [];


function init() {
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

    btn = document.querySelector("#party-button")
    btn.addEventListener("click", ()=>{
        // const img = document.createElement("img")
        // img.src="https://c.tenor.com/_4YgA77ExHEAAAAC/rick-roll.gif"
        alert("21+ ONLY!!!!")
    })

    //Create local copy of ratings database in ratings.JSON
    fetch(`http://localhost:3000/breweryRatings`)
    .then(response => response.json())
    .then(data => ratingsJson = data.map(x=>x));
}


function renderCard(brewery) {
    const cardsSection = document.querySelector('#brewery-cards')

    const divCard = document.createElement('div');
    divCard.id = brewery.id;

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

    setStarDisplay(event.target);

    const breweryCardElement = event.target.parentElement.parentElement

    //determine whether to post or patch
    if(ratingsJson.find(element => element.apiId === breweryCardElement.id)) {
        updateRating(event); //patch
    } else {
        postNewRating(event); //post
    }
}


function setStarDisplay(target) {
    let current = target;
    let prevSibling = current.previousElementSibling;

    //change star display
    current.textContent = starFull;
    while(prevSibling) {
        prevSibling.textContent = starFull;
        current = prevSibling;
        prevSibling = current.previousElementSibling;
    }
    current = target;
    let nextSibling = current.nextElementSibling
    while(nextSibling) {
        nextSibling.textContent = starEmpty;
        current = nextSibling;
        nextSibling = current.nextElementSibling;
    }
}


function updateRating(event) {
    const breweryCardElement = event.target.parentElement.parentElement
    const matchIndex = ratingsJson.findIndex(element => element.apiId === breweryCardElement.id);

    const obj = {
        rating : event.target.className.slice(-1),
    } 

    fetch(`http://localhost:3000/breweryRatings/${ratingsJson[matchIndex].id}`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
    })
    .then(response => response.json())
    .then(data => {
    console.log('Success:', data);
    ratingsJson[matchIndex] = data; //update ratingsJson
    })
    .catch((error) => {
    console.error('Error:', error);
    });
}


function postNewRating(event) {
    const breweryCardElement = event.target.parentElement.parentElement
    
    const obj = {
        apiId : breweryCardElement.id,
        rating : event.target.className.slice(-1),
    } 
    //update ratingsJson
    // ratingsJson.push(obj);
    // console.log(ratingsJson);
    
    fetch('http://localhost:3000/breweryRatings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      ratingsJson.push(data); //update ratingsJson
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


init();

/*
fetch all ratings and create local array out of them 
then edit that array when ratings are changed. if local rating exists, run "patch".
If not, run "post"
*/