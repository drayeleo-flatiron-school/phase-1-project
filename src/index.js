const starEmpty = "☆";
const starFull = "★";
let ratingsJson = [];


function init() {
    const form = document.querySelector("#user-input");

    //Create local copy of ratings database in ratingsJson
    fetch(`http://localhost:3000/breweryRatings`)
    .then(response => response.json())
    .then(data => {
        ratingsJson = data;
        console.log("ratingsJson: ", ratingsJson);
    });
    
    form.addEventListener("submit", (event) =>{
        event.preventDefault();
        const city = event.target["city-input"].value.toLowerCase();

        fetch(`https://api.openbrewerydb.org/breweries?by_city=${city}`)
        .then(response => response.json())
        .then(breweries => {
        console.log(`breweries data for ${city}: `, breweries);
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
}


function renderCard(brewery) {
    //console.log(brewery);
    const cardsSection = document.querySelector('#brewery-cards')

    const divCard = document.createElement('div');
    divCard.id = brewery.id;

    //render brewery name
    const breweryName = document.createElement('h2');
    breweryName.classList.add('name');
    breweryName.textContent = brewery.name;
    divCard.append(breweryName);

    //render brewery rating
    const rating = document.createElement('div');
    rating.classList.add('rating');
    let numstars = 0;
    if(ratingsJson.find(element => element.apiId === brewery.id)) {
        const matchIndex = ratingsJson.findIndex(element => element.apiId === brewery.id);
        numstars = ratingsJson[matchIndex].rating;
        console.log("numstars:", numstars);
    }
    for(let i = 0; i < 5; i++){
        const ratingButton = document.createElement('button');
        ratingButton.classList.add(`button-${i+1}`);
        numstars >= i+1 ? ratingButton.textContent = starFull : ratingButton.textContent = starEmpty;
        ratingButton.addEventListener('click', (event) => ratingButtonClickHandler(event));
        rating.append(ratingButton);
    }
    divCard.append(rating);

    //render brewery street
    const breweryStreet = document.createElement('p');
    breweryStreet.classList.add('street');
    breweryStreet.textContent = brewery.street;
    divCard.append(breweryStreet);

    //render brewery state
    const breweryCityState = document.createElement('p');
    breweryCityState.classList.add('city-state');
    breweryCityState.textContent = `${brewery.city}, ${brewery.state}`;
    divCard.append(breweryCityState);

    //render brewery phone
    const breweryPhone = document.createElement('p');
    breweryPhone.classList.add('phone');
    breweryPhone.textContent = brewery.phone;
    divCard.append(breweryPhone);

    //render brewery website link
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