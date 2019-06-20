'use strict';

let punkRoot = 'https://api.punkapi.com/v2/beers';

let untappd = '7F3A7A9E83A471AD7CBA0B3DE2E0859AB1D30B80';

let secret = 'B52CC502519EB68D22EB37EB522951292F938EFE';

let gMapKey = 'AIzaSyAuplbwDtbNqWr7AriUUgzJ1sjP-2mnOTc';

let appId = 'DsBOjirryJIduCfIy8os';

let appCode = 'vfmTdNWy_DoEnOseSPVF6Q';


function displayBeer(beer) {
    //display beer from
    console.log(beer);
    let defaultImage = beer.image_url === null ? $('.default-beer').attr('src') : beer.image_url;
    console.log(defaultImage);
    $('.beer-content').empty().append(`
    <img class="beer-icon" src="${defaultImage}" alt="beer-icon">
    <h1 class="name">${beer.name}</h1>
    <h2 class="tagline">${beer.tagline}</h2>
    <p class="description">${beer.description}</p>
    <div>
        <span>ABV: ${beer.abv}%</span>
        <span>IBU: ${beer.ibu}</span>
    </div>
    <div>
        <h2 class="food-pairings">Goes great with</h2>
        <p>${beer.food_pairing[0]}</p>
        <p>${beer.food_pairing[1]}</p>
        <p>${beer.food_pairing[2]}</p>
    </div>
    `);
    $('#beer').removeClass('hidden');
    $('.go-main').hide();
    $('.go-beer-list').on('click', function() {
        console.log($('.beer-list').is(':empty'));
        $('#beer').addClass('hidden');
        if ($('.beer-list').is(':empty')) {
            $('.go-main').show();
            $('#search-beer').removeClass('hidden');
        }
        else
            $('#beer-list-container').removeClass('hidden');
    });
}

function filterList(list, input) {
    //filter beer list based on user input (punk api search is very permisive)
    let regex = new RegExp(input, "i");
    let newList = [];
    for (let k in list) {
        if (regex.test(list[k].name))
            newList.push(list[k]);
    }
    return newList;
}

function displayBeerList(list, name) {
    //display beer list
    let beers = filterList(list, name);
    if (beers.length < 1) {
        $('.beer-list').append(`<p>Sorry, We did not find that beer</p>`)
    } else {
        for(let i = 0; i < beers.length; i++) {
            $('.beer-list').append(`
            <li class="beer">
                <a href="#" class="see-beer">${beers[i].name}</a>
            </li>
            `);
        }
    }
    
    $('#beer-list-container').removeClass('hidden');
    $('.go-main').hide();

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
        $('.go-main').show();
        $('#beer-list-container').addClass('hidden');
        $('.beer-list').empty();
        $('#search-beer').removeClass('hidden');
    });
}

function getRandomBeer() {
    //fetch random beer form punk api
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
    //fetch beers based on user input from punk api
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
                displayBeerList(responseJson, name);
            }
        })
        .catch(err => {
            alert(err);
        });

        $('html').css('height', null);
}

function beerSearch() {
   //listen for user input of random beer click
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

function displayVenue(venue) {
    //display venue
    let latLng = venue.location.lat + ',' + venue.location.lng;
    let address = {
        street: venue.location.venue_address,
        city: venue.location.venue_city,
        state: venue.location.venue_state,
    }
    //let addressString = getAddressString(address);
    let directions = getGmapsString(address);
    $('.brewery-content').append(`
    <div id="map">
    <img class="map" src="https://maps.googleapis.com/maps/api/staticmap?center=${latLng}
    &zoom=15&size=600x600&maptype=roadmap&markers=size:mid%7Ccolor:red%7C${latLng}&key=${gMapKey}"
    alt="local-map">
    </div>
    <a class="brew-info" href='http://maps.google.com/maps?q="${directions}"' rel="noopener noreferrer" target="_blank">${address.street}, ${address.city}, ${address.state}</a>
    <img class="icon" src="${venue.venue_icon.md}" alt="venue-logo">
    <h1 class="brew-info name">${venue.venue_name}</h1>
    <h2 class="brew-info type">${venue.categories.items[0].category_name}</h2>
    <ul class="social-list">
        <li class="social"><a class="social-link" href="${venue.contact.facebook}" rel="noopener noreferrer" target="_blank">Facebook</a></li>
        <li class="social"><a class="social-link" href="https://www.instagram.com/${venue.contact.instagram}/" rel="noopener noreferrer" target="_blank">Instagram</a></li>
        <li class="social"><a class="social-link" href="https://twitter.com/${venue.contact.twitter}/" rel="noopener noreferrer" target="_blank">Twitter</a></li>
        <li class="social"><a class="social-link" href="${venue.contact.venue_url}" rel="noopener noreferrer" target="_blank">Website</a></li>
    </ul>
    `);
    $('#brewery').removeClass('hidden');

    $('.go-brewery-list').on('click', 'button', function() {
        $('#brewery').addClass('hidden');
        $('.brewery-content').empty();
        if ($('.brewery-list').is(':empty')) {
            $('.go-main').show();
            $('#search-brewery').removeClass('hidden');
        }       
        else
            $('#brewery-list-container').removeClass('hidden');
    });
}


function getVenueInfo(id) {
    //get venue info 
    fetch(`https://api.untappd.com/v4/venue/info/${id}?&compact=true&client_id=${untappd}&client_secret=${secret}`)
        .then(response => response.json())
        .then(responseJson => displayVenue(responseJson.response.venue))
}

function getVenue(name) {
    //search for venue by name from Untappd api in order to get venue id
    fetch(`https://api.untappd.com/v4/search/venue?q=${name.title}&client_id=${untappd}&client_secret=${secret}`)
        .then(response => response.json())
        .then(responseJson => {
            let vicinity = responseJson.response.venues.items
            let venue;
            for (let i = 0; i < vicinity.length; i++){
                let venueCity = vicinity[i].venue.venue_city;
                let regex = new RegExp ("(?<=>)" + venueCity + "(?=,)")
                if(regex.test(name.vicinity)) {
                    venue = vicinity[i].venue.venue_id;
                    getVenueInfo(vicinity[i].venue.venue_id)
                }
            }
            if (venue === undefined)
                throw new Error ('Sorry, we did not find any information on that venue')
        })
        .catch(Error => {
            $('.brewery-content').append(`<p>${Error}</p>`)
            $('#brewery').removeClass('hidden');
            $('.go-brewery-list').on('click', 'button', function() {
                $('.brewery-content').empty();
                $('#brewery').addClass('hidden');
                if ($('.brewery-list').is(':empty'))
                    $('#search-brewery').removeClass('hidden');
                else
                    $('#brewery-list-container').removeClass('hidden');
            });
        });
}

function getGmapsString(address) {
    //format address to fetch map from static map api
    return encodeURIComponent(`${address.street} ${address.city}, ${address.state}`)
}

function displayBrewery(brewery) {
    //display brewery to DOM
    let latLng = brewery.location.brewery_lat + ',' + brewery.location.brewery_lng;
    let address = {
        street: brewery.location.brewery_address,
        city: brewery.location.brewery_city,
        state: brewery.location.brewery_state,
    }

    let directions = getGmapsString(address);
    $('.brewery-content').empty().append(`
    <div id="map">
    <img class="map" src="https://maps.googleapis.com/maps/api/staticmap?center=${latLng}
    &zoom=15&size=600x600&maptype=roadmap&markers=size:mid%7Ccolor:red%7C${latLng}&key=${gMapKey}"
    alt="local-map">
    </div>
    <a class="brew-info address" href='http://maps.google.com/maps?q="${directions}"' rel="noopener noreferrer" target="_blank">${address.street}, ${address.city}, ${address.state}</a>
    <img class="icon" src="${brewery.brewery_label}" alt="brewery-logo">
    <h1 class="brew-info name">${brewery.brewery_name}</h1>
    <h2 class="brew-info type">${brewery.brewery_type}</h2>
    <p class"brew-info description">${brewery.brewery_description}</p>
    <ul class="social-list">
        <li class="social"><a class="social-link" href="${brewery.contact.facebook}" rel="noopener noreferrer" target="_blank">Facebook</a></li>
        <li class="social"><a class="social-link" href="https://www.instagram.com/${brewery.contact.instagram}/" rel="noopener noreferrer" target="_blank">Instagram</a></li>
        <li class="social"><a class="social-link" href="https://twitter.com/${brewery.contact.twitter}/" rel="noopener noreferrer" target="_blank">Twitter</a></li>
        <li class="social"><a class="social-link" href="${brewery.contact.url}" rel="noopener noreferrer" target="_blank">Website</a></li>
    </ul>
    `);

    $('.go-brewery-list').on('click', 'button', function() {
        $('#brewery').addClass('hidden');
        $('.brewery-content').empty();
        if ($('.brewery-list').is(':empty')) {
            $('.go-main').show();
            $('#search-brewery').removeClass('hidden');
        } 
        else
            $('#brewery-list-container').removeClass('hidden');
    });
}

function getBreweryInfo(brewery) {
    //get brewery info using brewery ID from Untappd
    fetch(`https://api.untappd.com/v4/brewery/info/${brewery.brewery.brewery_id}?compact=true&client_id=${untappd}&client_secret=${secret}`)
        .then(response => response.json())
        .then(responseJson => {
            displayBrewery(responseJson.response.brewery);
        });
}

function getBreweryID(name) {
    //gets brewery ID from Untappd
    fetch(`https://api.untappd.com/v4/search/brewery?q=${name.title}&client_id=${untappd}&client_secret=${secret}`)
        .then(response => response.json())
        .then(responseJson => {
            let specBrew;
            for(let i = 0; i < responseJson.response.brewery.items.length; i++){
                let item = responseJson.response.brewery.items[i].brewery.location;
                let loc = name.position;
                if (Math.round(item.lat) === Math.round(loc[0]) && Math.round(item.lng) === Math.round(loc[1])) {
                    specBrew = responseJson.response.brewery.items[i];
                    getBreweryInfo(specBrew);
                }
            }
            if (specBrew === undefined)
                //if no brewery is found search for venues with same name
                getVenue(name);
        });
}

function loadMoreBreweries(list) {
    if (list.length - 25 > 25) {
        $('.brewery-list').empty();
        for(let i = 25; i < 50; i++) {
            displayBreweryList(breweryList[i].name);
        }
    } else {
        for(let i = 25; i < list.length; i++) {
            displayBreweryList(breweryList[i].name);
        }
    }
}

function displayBreweryList(name) {
    //display all list items
    $('.brewery-list').append(`
    <li class="brewery">
        <a href='#' class="see-brewery">${name}</a>
    </li>
    `);
}


function manageList(list) {
    //manage list length (used before the beer mapping project went down)
    if (list.length <= 25) {
        for(let i = 0; i < list.length; i++) {
            displayBreweryList(list[i].title);
        }
    } else {
        for(let i = 0; i < 25; i++) {
            displayBreweryList(list[i].title);
        }
    } 
    
    $('#brewery-list-container').removeClass('hidden');
    $('.go-main').hide();
    $('.brewery-list').on('click', 'a', function() {
        let selection = $(this)[0].innerText;
        $('#brewery-list-container').addClass('hidden');
        for (var n in list) {
            if (list[n].title === selection)
                getBreweryID(list[n]);
        }
        $('#brewery').removeClass('hidden');
    });

    $('.go-search-brewery').on('click', 'button', function() {
        $('.go-main').show();
        $('#brewery-list-container').addClass('hidden');
        $('.brewery-list').empty();
        $('#search-brewery').removeClass('hidden');
    })
}

function getBreweryList(latLng) {
    //fetch list of breweries in users area (lat and long) using Here api
    $('.form-content').val('');
    fetch(`https://places.api.here.com/places/v1/discover/search?app_id=${appId}&app_code=${appCode}&q=brewery&at=${latLng}`)
        .then(response => response.json())
        .then(responseJson => manageList(responseJson.results.items))
        .catch(Error => {
            alert(Error);
        });
}


function getLatLng(city) {
    //get lat and long based on user input in brewery search
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${gMapKey}`)
        .then(response => response.json())
        .then(responseJson => {
            if (responseJson.status === 'ZERO_RESULTS') {
                throw new Error('Sorry, we did not find that city, please try again');
            } else {
                let latLng = responseJson.results[0].geometry.location.lat + ',' + responseJson.results[0].geometry.location.lng;
                getBreweryList(latLng);
            }
        })
        .catch(Error => {
            alert(Error);
        });
}

function brewerySearch() {
    //listen for user to submit brewery criteria form
    $('#brewery-criteria').on('submit', function() {
        event.preventDefault();
        $('#search-brewery').addClass('hidden');
        let city = $('.city-input').val().trim() + ',+' + $('.state-input').val().trim();
        getLatLng(city);
    })

    /*$('#random-brewery').on('click', function() {
        event.preventDefault();
        $('.brewery-list').empty();
        getRandomBrewery();
    })*/

    $('html').css('height', '100%')
}

function selectSearch() {
    //listen for user to choose beer or brewery search
    $('.option-beer').on('click', function() {
        let width = screen.width
        $('#main-page').addClass('hidden');
        if (width < 450){
            $('.button-container').css('justify-content', 'space-between');
        }
        $('#nav-title').slideUp();
        $('#nav-title, .nav-button').hide().removeClass('hidden').slideDown();
        $('#search-beer').removeClass('hidden');
    });

    $('.option-brewery').on('click', function() {
        let width = screen.width
        $('#main-page').addClass('hidden');
        if (width < 450){
            $('.button-container').css('justify-content', 'space-between');
        }
        $('#nav-title').slideUp();
        $('#nav-title, .nav-button').hide().removeClass('hidden').slideDown();
        $('#search-brewery').removeClass('hidden');
    });

    $('.go-main').on('click', 'button', function() {
        let width = screen.width
        $('#search-beer, #search-brewery').addClass('hidden');
        $('#nav-title, .nav-button').slideUp('slow', function(){
            if (width < 450){
                $('.button-container').css('justify-content', 'center');
            }
            $('.nav-button').hide();
            $('#nav-title').slideDown();
        });
        $('#main-page').removeClass('hidden');
    });
}

function landing() {
    $('#initiate').on('click', function() {
        $('#landingpage').addClass('hidden');
        $('html, body').animate({scrollTop: 0}, 'slow');
        $('.go-main').slideDown();
        $('#main-page').removeClass('hidden');
    })

    $('#about').on('click', function() {
        event.preventDefault();
        $(this).addClass('hidden');
        $('#about-text').slideDown();
    })

    $(document).on("scroll", function() {
        $('p.animation_element').slideUp();
        $('#diffLang').addClass('container');
        let pageTop = $(document).scrollTop();
        let pageBottom = pageTop + $(window).height();
        let section = $('.on-scroll');
        
        for (let i = 0; i < section.length; i++) {
            let tag = section[i];
        
            if ($(tag).position().top < pageBottom) {
                 $(tag).addClass('visible')
            } else {
                $(tag).removeClass('visible')
            }
        }
    })
}


function unaCervezaPorFavor() {
    $(window).on('beforeunload', function() {
        $(window).scrollTop(0); 
    });
    landing();
    selectSearch();
    beerSearch();
    brewerySearch();
}

$(unaCervezaPorFavor);