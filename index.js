'use strict';
let locCity = 'http://beermapping.com/webservice/loccity';

let beerMap = '2322f94129d492b2c563ca8cd7af96c0';

let punkRoot = 'https://api.punkapi.com/v2/beers';

let gMapKey = '';

function displayBeer(beer) {
    console.log(beer);
    $('.beer-content').empty().append(`
    <img class="beer-icon" src="${beer.image_url}" alt="beer-icon">
    <h1 class="name">${beer.name}</h1>
    <h2 class="tagline">${beer.tagline}</h2>
    <p class="info">${beer.description}</p>
    <div>
        <span>ABV: ${beer.abv}%</span>
        <span>IBU: ${beer.ibu}</span>
    </div>
    <div>
        <h2>Goes great with</h2>
        <p>${beer.food_pairing[0]}</p>
        <p>${beer.food_pairing[1]}</p>
        <p>${beer.food_pairing[2]}</p>
    </div>
    `);
    $('#beer').removeClass('hidden');
    $('.go-beer-list').on('click', function() {
        console.log($('.beer-list').is(':empty'));
        $('#beer').addClass('hidden');
        if ($('.beer-list').is(':empty'))
            $('#search-beer').removeClass('hidden');
        else
            $('#beer-list-container').removeClass('hidden');
    });
}

function displayBeerList(list) {
    for(let i = 0; i < list.length; i++) {
        $('.beer-list').append(`
        <li class="beer">
            <a href="#" class="see-beer">${list[i].name}</a>
        </li>
        `);
    }
    $('#beer-list-container').removeClass('hidden');

    $('.beer-list').on('click', 'a', function() {
        let selection = $(this)[0].innerText;
        for (var n in list) {
            if (list[n].name === selection){
                $('#beer-list-container').addClass('hidden');
                displayBeer(list[n]);
            }
        }
    });

    $('.go-search-beer').on('click', 'button', function() {
        $('#beer-list-container').addClass('hidden');
        $('.beer-list').empty();
        $('#search-beer').removeClass('hidden');
    });
}

function getRandomBeer() {
    fetch(`${punkRoot}/random`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else
                throw new Error(response.statusText);
        })
        .then(responseJson => {
            $('#search-beer').addClass('hidden');
            displayBeer(responseJson[0])
        })
        .catch(err => {
            console.log(err);
        });
}

function getBeerList(name) {
    fetch(`${punkRoot}?beer_name=${name}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else
                throw new Error(response.statusText);
        })
        .then(responseJson => {
            if (responseJson.length < 1)
                throw new Error("sorry, that beer was not found");
            else {
                $('#search-beer').addClass('hidden');
                displayBeerList(responseJson);
            }
        })
        .catch(err => {
            alert(err);
        });
}

function beerSearch() {
    $('.random-beer').on('click', function() {
        $('.form-content').val('');
        $('.beer-list').empty();
        getRandomBeer();
    })
    $('#beer-criteria').on('submit', function() {
        event.preventDefault();
        let beerName = $('.beer-input').val();
        $('.form-content').val('');
        getBeerList(beerName);
    })

}


function getAddressString(address) {
    let streetString = address.street.split(' ').join('+').replace('#', '');
    let cityString = address.city.split(' ').join('+');
    return streetString.concat(',', cityString).concat(',+', address.state);
}

function displayBrewery(brewery) {
    console.log(brewery);
    let address = {
        street: brewery.street,
        city: brewery.city,
        state: brewery.state
    }
    let addressString = getAddressString(address);
    $('.brewery-content').empty().append(`
    <div id="map">
    <img class="map" src="https://maps.googleapis.com/maps/api/staticmap?center=${addressString}
    &zoom=15&size=600x600&maptype=roadmap&markers=size:mid%7Ccolor:red%7C${addressString}&key=${gMapKey}"
    alt="local-map">
    </div>
    <a href="#">${address.street}, ${address.city}, ${address.state} ${brewery.zip}</a>
    <h1 class="name">${brewery.name}</h1>
    <h2 class="info">${brewery.status}</h2>
    <a href="#">${brewery.phone}</a>
    `);
    $('#brewery').removeClass('hidden');

    $('.go-brewery-list').on('click', 'button', function() {
        $('#brewery').addClass('hidden');
        if ($('.brewery-list').is(':empty'))
            $('#search-brewery').removeClass('hidden');
        else
            $('#brewery-list-container').removeClass('hidden');
    });
}

function displayBreweryList(list) {
    console.log('ran');

    for(let i = 0; i < list.length; i++) {
        $('.brewery-list').append(`
        <li class="brewery">
            <a href='#' class="see-brewery">${list[i].name}</a>
        </li>
        `);
    }
    $('#brewery-list-container').removeClass('hidden');
    $('.brewery-list').on('click', 'a', function() {
        let selection = $(this)[0].innerText;
        console.log($(this)[0].innerText)
        $('#brewery-list-container').addClass('hidden');
        for (var n in list) {
            if (list[n].name === selection)
                displayBrewery(list[n]);
        }
    });

    $('.go-search-brewery').on('click', 'button', function() {
        $('#brewery-list-container').addClass('hidden');
        $('.brewery-list').empty();
        $('#search-brewery').removeClass('hidden');
    })
}

function getRandomBrewery() {
    let city = $('.city-input').val();
    let state = $('.state-input').val();
    $('.form-content').val('');
    fetch(`http://beermapping.com/webservice/loccity/${beerMap}/${city},${state}&s=json`)
        .then(response => response.json())
        .then(responseJson => {
            if (responseJson[0].id === null)
                throw new Error('Something went wrong please try again');
            else {
                let random = Math.floor(Math.random()*(responseJson.length));
                console.log(random);
                $('#search-brewery').addClass('hidden');
                displayBrewery(responseJson[random]);
            }
        })
        .catch(err => {
            alert('Sorry, an address is needed to find the alcohol');
        });
}


function getBreweryList() {
    let city = $('.city-input').val().trim();
    let state = $('.state-input').val().trim();
    $('.form-content').val('');
    fetch(`http://beermapping.com/webservice/loccity/${beerMap}/${city},${state}&s=json`)
        .then(response => response.json())
        .then(responseJson => {
            if (responseJson[0].id === null)
                throw new Error('Something went wrong pleas try again');
            else {
                $('#search-brewery').addClass('hidden');
                displayBreweryList(responseJson);
            }        
        })
        .catch(err => {
            alert('Sorry, that city was not found');
        });
}

function brewerySearch() {
    $('#brewery-criteria').on('submit', function() {
        event.preventDefault();
        getBreweryList();
    })

    $('#random-brewery').on('click', function() {
        event.preventDefault();
        $('.brewery-list').empty();
        getRandomBrewery();
    })
}

function selectSearch() {
    $('.option-beer').on('click', function() {
        $('#main-page').addClass('hidden');
        $('#search-beer').removeClass('hidden');
    });

    $('.option-brewery').on('click', function() {
        $('#main-page').addClass('hidden');
        $('#search-brewery').removeClass('hidden');
    });

    $('.go-main').on('click', function() {
        $('#search-beer, #search-brewery').addClass('hidden');
        $('#main-page').removeClass('hidden');
    });
}

function login() {
    $('#login').on('click', 'button', function() {
        $('#login').addClass('hidden');
        $('#main-page').removeClass('hidden');
    })
}

function unaCervezaPorFavor() {
    login();
    selectSearch();
    beerSearch();
    brewerySearch();
}

$(unaCervezaPorFavor);