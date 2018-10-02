let map;
let infowindow;
const WEATHER_SEARCH_URL = 'https://api.openweathermap.org/data/2.5/find';
let myLat;
let myLong;
let weatherLat;
let weatherLong;

//This function initializes a google map

function initMap() {
  let local = {lat: 33.608, lng: -84.361};
  map = new google.maps.Map(document.getElementById('map'), {
    center: local,
    zoom: 12.5
  });
}

//This function updates the map using GPS coordinates obtained from 
//html geolocation API.

function updateMapInfo() {
  map.setCenter({lat: myLat, lng: myLong}); 
  infowindow = new google.maps.InfoWindow();
  let request = {
    location: {lat: myLat, lng: myLong},
    radius: '500',
    query: 'car repair shop'
  };
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, displayMarkers);
}

//This function updates the map using GPS coordinates obtained from the
//weather API based on the city or zip code entered. 

function updateMapInfoCity() {
  map.setCenter({lat: weatherLat, lng: weatherLong});
  infowindow = new google.maps.InfoWindow();
  let request = {
    location: {lat: weatherLat, lng: weatherLong},
    radius: '500',
    query: 'car repair shop'
  };
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, displayMarkers);
}

//This function displays markers on the map for shop locations in 
//the area.  It also displays the list of shops underneath the map.

function displayMarkers(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    let shopList = '';
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i]);
      shopList += `<li class="list-item">${results[i].name} ${results[i].formatted_address}</li>`;
    };
    $(".js-waiting-icon").hide();
    $(".js-scroll").show();
    $('.js-list-items').html(shopList);
  };
}

function createMarker(place) {
  let placeLoc = place.geometry.location;
  let marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(`<h3>${place.name}</h3><h4>${place.formatted_address}</h4>`);
    infowindow.open(map, this);
  });
}

//This function obtains weather data based either on user city or zip code
//input or Lat and Long obtained from geolocation API.

function getDataFromWeatherApi(lat1, long1, userInput, callback) {
  const query = {
    lat: lat1,
    lon: long1,
    q: userInput,
    type: 'like',
    units: 'imperial',
    appid: '0c71fc03b2b136bb5a5a20de50504d84',   
  };
  $.getJSON(WEATHER_SEARCH_URL, query, callback);
}

function tryAgain() {
  $(".js-waiting-icon").hide();
  $(".js-background").show();
  $(".js-search-form").hide();
  $(".js-error").html(`No data for this location.  Please search again.`);
  $(".js-error").show();
  $(".js-fail-button").show();
}

function displayWeatherData(data) {
  if ((data.cod === "200") && (data.count > 0)) {
    console.log(data.cod);
    console.log(data.count);
    const results = `<div class="weather-info">${data.list[0].main.temp} degrees F and ${data.list[0].main.humidity}% humidity</div>`;
    weatherLong = data.list[0].coord.lon;
    weatherLat = data.list[0].coord.lat;
    updateMapInfoCity();
    $("#map").show();
    $(".js-list-items").show();
    $(".js-weather-list").show();
    $(".js-back").show();
    $('.js-weather-list').html(results);
  } else {
    tryAgain();
    };
}

function renderForm() {
  return `
      <form action="#" class="js-search-form">
        <label for="query"><h2>Enter a city or zip code</h2></label>
        <input type="text" id="query" class="js-query" placeholder="Exp: Atlanta or 30297" required>
        <button type="submit">Search</button>
      </form>
      <div id="userInput"></div>`;
}

function displayForm() {
  $("#userForm").html(renderForm);
}

function handleSearchButtonClick() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    if (query.length < 3) {
      $(".user-input").hide();
      tryAgain();
    } else {
      queryTarget.val("");
      $(".js-waiting-icon").show();
      $(".js-background").hide();
      $(".user-input").hide();
      $('#copyright').hide();
      getDataFromWeatherApi('','',query, displayWeatherData);
    };  
 });
}

function getLocation() {      
  if (navigator.geolocation) {
    const x = navigator.geolocation;
    x.getCurrentPosition(success, failure);

    function success(position) {  
      $(".js-waiting-icon").show();  
      myLat = position.coords.latitude;
      myLong = position.coords.longitude;
      updateMapInfo();
      getDataFromWeatherApi(myLat, myLong, '', displayWeatherData);
      $(".js-background").hide();
      $("#failure").hide();       
    };

    function failure() {     
      $("#failure").html('Cannot show your location unless you choose allow');
      $("#failure").show();
      $(".js-waiting-icon").hide();
      $(".js-fail-button").show();
      $(".js-background").show();
    };
  } else {         
    $("#failure").html('Geolocation is not supported by Your browser.  Search by location.');
    $(".js-fail-button").show();
  };       
}

function handleAnywhereButtonClick() {
  $('.js-location-anywhere').on('click', function(event) {
    displayForm();
    handleSearchButtonClick();
  });
}

function handleLocationButtonClick() {
  $('.js-location-near-me').on('click', function(event) { 
    $(".user-input").hide();
    $("#copyright").hide();
    getLocation();
  });
}

function handleFailButtonClick() {
  $(".js-fail-button").on('click', function(event) {
    $(".js-error").hide();
    $(".js-fail-button").hide();
    $("#failure").hide();
    $("#copyright").show();
    $(".user-input").show();
    $(".js-search-form").hide();
  });
}

function handleBackButtonClick() {
  $(".js-back").on('click', function(event) {
    $(".js-list-items").hide();
    $(".js-weather-list").hide();
    $("#map").hide();
    $(".js-scroll").hide();
    $(".js-back").hide();
    $(".js-search-form").hide();
    $(".js-error").hide();
    $("#failure").hide();
    $("#copyright").show();
    $(".js-background").show();
    $(".user-input").show();
  });
}

function hideElementsOnStartup() {
  $(".js-waiting-icon").show();
  $(".js-list-items").hide();
  $(".js-scroll").hide();
  $(".js-fail-button").hide();
  $(".js-back").hide();
  $("#map").hide();
  $(".js-waiting-icon").hide();
}

function shopFinderApp() {
  hideElementsOnStartup();
  handleFailButtonClick();
  handleBackButtonClick();
  handleLocationButtonClick();
  handleAnywhereButtonClick();
}

$(shopFinderApp);



