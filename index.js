'use strict';
let locCity = 'http://beermapping.com/webservice/loccity';

let beerMap = '2322f94129d492b2c563ca8cd7af96c0';

let punkRoot = 'https://api.punkapi.com/v2/beers';

function displayBeer(beer) {
    console.log(beer);
}

function displayBeerList(list) {
    for(let i = 0; i < list.length; i++) {
        $('.beer-list').append(`
        <li class="beer">
            <p class="beer">${list[i].name}</p>
        </li>
        `);
    }
    $('#beer-list-container').removeClass('hidden');
}

function getRandomBeer() {
    fetch(`${punkRoot}/random`)
        .then(response => response.json())
        .then(responseJson => displayBeer(responseJson[0]));
}

function getBeerList(name) {
    fetch(`${punkRoot}?beer_name=${name}`)
        .then(response => response.json())
        .then(responseJson => displayBeerList(responseJson));
}

function beerSearch() {
    $('.random-beer').on('click', function() {
        getRandomBeer();
    })
    $('#beer-criteria').on('submit', function() {
        event.preventDefault();
        let beerName = $('.beer-input').val();
        $('#search-beer').addClass('hidden');
        getBeerList(beerName);
    })
}

function displayBrewery(brewery) {
    $('.brewery-list').on('click', 'p', function() {
        console.log($(this)[0].innerText);
    });
}

function displayBreweryList(list) {
    for(let i = 0; i < list.length; i++) {
        $('.brewery-list').append(`
        <li class="brewery">
            <p class="brewery">${list[i].name}</p>
        </li>
        `);
    }
    $('#brewery-list-container').removeClass('hidden');
    displayBrewery();
}

function getRandomBrewery() {
    let city = $('.city-input').val();
    let state = $('.state-input').val();
    fetch(`http://beermapping.com/webservice/loccity/${beerMap}/${city},${state}&s=json`)
        .then(response => response.json())
        .then(responseJson => {
            let random = Math.floor(Math.random()*(responseJson.length));
            console.log(random);
            displayBrewery(responseJson[random]);
        });
}

function getBreweryList() {
    let city = $('.city-input').val();
    let state = $('.state-input').val();
    let list;
    fetch(`http://beermapping.com/webservice/loccity/${beerMap}/${city},${state}&s=json`)
        .then(response => response.json())
        .then(responseJson => {
            displayBreweryList(responseJson);
        });
}

function brewerySearch() {
    $('#brewery-criteria').on('click','.list-breweries', function() {
        event.preventDefault();
        $('#search-brewery').addClass('hidden');
        getBreweryList();
    })

    $('#brewery-criteria').on('click','.random-brewery', function() {
        event.preventDefault();
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