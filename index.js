'use strict';
let beerSpot = '1b5ef58e552a5a9599d407e21ea6d498'

let beerMap = '2322f94129d492b2c563ca8cd7af96c0'

function getRandomBeer() {
    const options = {
        HTTP_ACCEPT: 'application/json'
    }
    fetch(`http://www.thebeerspot.com/api/search`, options)
        .then(response => response.json())
        .then(responseJson => console.log(responseJson));
}

function beerSearch() {
    $('.random-beer').on('click', function() {
        getRandomBeer();
    })
}

function selectSearch() {
    $('.option-beer').on('click', function() {
        console.log('ran');
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
}

$(unaCervezaPorFavor);