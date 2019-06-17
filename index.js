'use strict';

let punkRoot = 'https://api.punkapi.com/v2/beers';

let untappd = '7F3A7A9E83A471AD7CBA0B3DE2E0859AB1D30B80';

let secret = 'B52CC502519EB68D22EB37EB522951292F938EFE';

let gMapKey = 'AIzaSyAuplbwDtbNqWr7AriUUgzJ1sjP-2mnOTc';

let appId = 'DsBOjirryJIduCfIy8os';

let appCode = 'vfmTdNWy_DoEnOseSPVF6Q';


function displayBeer(beer) {
    console.log(beer);
    $('.beer-content').empty().append(`
    <img class="beer-icon" src="${beer.image_url}" alt="beer-icon">
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
    $('.go-beer-list').on('click', function() {
        console.log($('.beer-list').is(':empty'));
        $('#beer').addClass('hidden');
        if ($('.beer-list').is(':empty'))
            $('#search-beer').removeClass('hidden');
        else
            $('#beer-list-container').removeClass('hidden');
    });
}

function filterList(list, input) {
    let regex = new RegExp(input, "i");
    let newList = [];
    for (let k in list) {
        if (regex.test(list[k].name))
            newList.push(list[k]);
    }
    return newList;
}

function displayBeerList(list, name) {
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
                displayBeerList(responseJson, name);
            }
        })
        .catch(err => {
            alert(err);
        });

        $('html').css('height', null);
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

function displayVenue(venue) {
    console.log(venue);
    let latLng = venue.location.lat + ',' + venue.location.lng;
    let address = {
        street: venue.location.venue_address,
        city: venue.location.venue_city,
        state: venue.location.venue_state,
    }
    //let addressString = getAddressString(address);
    let directions = getGmapsString(address);
    $('.brewery-content').empty().append(`
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
        <li class="social"><a class="social-link" href="${venue.contact.facebook}">Facebook</a></li>
        <li class="social"><a class="social-link" href="https://www.instagram.com/${venue.contact.instagram}/" rel="noopener noreferrer" target="_blank">Instagram</a></li>
        <li class="social"><a class="social-link" href="https://twitter.com/${venue.contact.twitter}/" rel="noopener noreferrer" target="_blank">Twitter</a></li>
        <li class="social"><a class="social-link" href="${venue.contact.venue_url}" rel="noopener noreferrer" target="_blank">Website</a></li>
    </ul>
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


function getVenueInfo(id) {
    fetch(`https://api.untappd.com/v4/venue/info/${id}?&compact=true&client_id=${untappd}&client_secret=${secret}`)
        .then(response => response.json())
        .then(responseJson => displayVenue(responseJson.response.venue))
}

function getVenue(name) {
    console.log('ran')
    fetch(`https://api.untappd.com/v4/search/venue?q=${name.title}&client_id=${untappd}&client_secret=${secret}`)
        .then(response => response.json())
        .then(responseJson => {
            console.log(responseJson);
            let vicinity = responseJson.response.venues.items
            for (let i = 0; i < vicinity.length; i++){
                let venueCity = vicinity[i].venue.venue_city;
                let regex = new RegExp ("(?<=>)" + venueCity + "(?=,)")
                if(regex.test(name.vicinity)) {
                    getVenueInfo(vicinity[i].venue.venue_id)
                }
            }
        })
}

function getGmapsString(address) {
    return encodeURIComponent(`${address.street} ${address.city}, ${address.state}`)
}

function displayBrewery(brewery) {
    console.log(brewery);
    let latLng = brewery.location.brewery_lat + ',' + brewery.location.brewery_lng;
    let address = {
        street: brewery.location.brewery_address,
        city: brewery.location.brewery_city,
        state: brewery.location.brewery_state,
    }
    //let addressString = getAddressString(address);
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
        <li class="social"><a class="social-link" href="${brewery.contact.facebook}">Facebook</a></li>
        <li class="social"><a class="social-link" href="https://www.instagram.com/${brewery.contact.instagram}/" rel="noopener noreferrer" target="_blank">Instagram</a></li>
        <li class="social"><a class="social-link" href="https://twitter.com/${brewery.contact.twitter}/" rel="noopener noreferrer" target="_blank">Twitter</a></li>
        <li class="social"><a class="social-link" href="${brewery.contact.url}" rel="noopener noreferrer" target="_blank">Website</a></li>
    </ul>
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

function getBreweryInfo(brewery) {
    fetch(`https://api.untappd.com/v4/brewery/info/${brewery.brewery.brewery_id}?compact=true&client_id=${untappd}&client_secret=${secret}`)
        .then(response => response.json())
        .then(responseJson => {
            displayBrewery(responseJson.response.brewery);
        });
}

function getBreweryID(name) {
    console.log(name);
    fetch(`https://api.untappd.com/v4/search/brewery?q=${name.title}&client_id=${untappd}&client_secret=${secret}`)
        .then(response => response.json())
        .then(responseJson => {
            console.log(responseJson);
            let specBrew;
            for(let i = 0; i < responseJson.response.brewery.items.length; i++){
                let item = responseJson.response.brewery.items[i].brewery.location;
                let loc = name.position;
                if (Math.round(item.lat) === Math.round(loc[0]) && Math.round(item.lng) === Math.round(loc[1])) {
                    specBrew = responseJson.response.brewery.items[i];
                    console.log(specBrew);
                    getBreweryInfo(specBrew);
                }
            }
            if (specBrew === undefined)
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
    $('.brewery-list').append(`
    <li class="brewery">
        <a href='#' class="see-brewery">${name}</a>
    </li>
    `);
}


function manageList(list) {
    console.log(list);
    if (list.length <= 25) {
        for(let i = 0; i < list.length; i++) {
            displayBreweryList(list[i].title);
        }
    } else {
        for(let i = 0; i < 25; i++) {
            displayBreweryList(list[i].title);
        }
    } 
    
    $('js-load-more').on('click', function() {
        loadMoreBreweries(list);
    });

    $('#brewery-list-container').removeClass('hidden');
    $('.brewery-list').on('click', 'a', function() {
        let selection = $(this)[0].innerText;
        console.log($(this)[0].innerText)
        $('#brewery-list-container').addClass('hidden');
        for (var n in list) {
            if (list[n].title === selection)
                getBreweryID(list[n]);
        }
    });

    $('.go-search-brewery').on('click', 'button', function() {
        $('#brewery-list-container').addClass('hidden');
        $('.brewery-list').empty();
        $('#search-brewery').removeClass('hidden');
    })
}

function getLatLng(city) {
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

function getBreweryList(latLng) {
    $('.form-content').val('');
    fetch(`https://places.api.here.com/places/v1/discover/search?app_id=${appId}&app_code=${appCode}&q=brewery&at=${latLng}`)
        .then(response => response.json())
        .then(responseJson => manageList(responseJson.results.items))
        .catch(Error => {
            alert(Error);
        });
}

function brewerySearch() {
    $('#brewery-criteria').on('submit', function() {
        event.preventDefault();
        $('#search-brewery').addClass('hidden');
        let city = $('.city-input').val().trim() + ',+' + $('.state-input').val().trim();
        getLatLng(city);
    })

    $('#random-brewery').on('click', function() {
        event.preventDefault();
        $('.brewery-list').empty();
        getRandomBrewery();
    })

    $('html').css('height', '100%')
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

    $('.go-main').on('click', 'button', function() {
        $('#search-beer, #search-brewery').addClass('hidden');
        $('#main-page').removeClass('hidden');
    });
}

function landing() {
    $('#initiate').on('click', function() {
        $('#landingpage').addClass('hidden');
        $('html, body').animate({scrollTop: 0}, 'slow');
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