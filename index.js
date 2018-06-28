let map;
let infowindow;
const WEATHER_SEARCH_URL = 'https://api.openweathermap.org/data/2.5/find';
let myLat;
let myLong;
let weatherLat;
let weatherLong;

function initMap() {
  let local = {lat: 33.608, lng: -84.361};

  map = new google.maps.Map(document.getElementById('map'), {
    center: local,
    zoom: 12.5
  });

  /*infowindow = new google.maps.InfoWindow();

   let request = {
    location: local,
    radius: '500',
    query: 'car repair shop'
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, displayMarkers);
  getDataFromWeatherApi(33.608, -84.361,'',displayWeatherData);
  //updateMapInfo();*/

}

/*setTimeout(function(){
  updateMapInfo();
}, 6000)*/

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
  //updateMapInfo();  
}

function updateMapInfoCity() {
  console.log(weatherLat);
  console.log(weatherLong);
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

function displayMarkers(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    let shopList = '';
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i]);
      shopList += `<li class="list-item">${results[i].name} ${results[i].formatted_address}</li>`;
    }
    $('.js-list-items').html(shopList);
  }
}

function createMarker(place) {
  let placeLoc = place.geometry.location;
  let marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(`<h3>${place.name}</h3><h4>${place.formatted_address}</h4>`);
    //infowindow.setContent(place.formatted_address);
    infowindow.open(map, this);
  });
}

function getDataFromWeatherApi(lat1, long1, userInput, callback) {
  const query = {
    lat: lat1,
    lon: long1,
    q: userInput,
    units: 'imperial',
    appid: '0c71fc03b2b136bb5a5a20de50504d84',   
  }
  $.getJSON(WEATHER_SEARCH_URL, query, callback);
}

function tryAgain() {
  $(".js-error").html(`No data for this location.  Please search again.`);
  $(".js-error").show();
  $(".js-back").show();
}

function displayWeatherData(data) {
  if (data.count > 0) {
    const results = [`<div class="weather-info">${data.list[0].main.temp} degrees F, and ${data.list[0].main.humidity} % humidity</div>`];
    console.log(results);
    //$('.js-weather-list').html(results);
    weatherLong = data.list[0].coord.lon;
    weatherLat = data.list[0].coord.lat;
    updateMapInfoCity();
    $("#map").show();
    $(".js-list-items").show();
    $(".js-weather-list").show();
    $(".js-back").show();
    $('.js-weather-list').html(results);
    console.log(weatherLat);
    console.log(weatherLong);
  } else {
    tryAgain();
  };
}

function renderForm() {
  return `
      <form action="#" class="js-search-form">
        <label for="query"><h2>Enter a city or zip code</h2></label>
        <input type="text" id="query" class="js-query" placeholder="Example: Atlanta or 30297" required>
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
    console.log(query);
    // clear out the input
    //$("#userInput").html(`<p>The location you entered is ${query}</p>`);
    queryTarget.val("");
    $(".user-input").hide();
    
    getDataFromWeatherApi('','',query, displayWeatherData);
    
    //showData();
    //updateMapInfoCity();
    //getDataFromWeatherApi(query, displayWeatherData);
    //$('.home-screen').hide();   
 });
}

function getLocation() {
        
        if (navigator.geolocation) {
          $('.loading').show();
          const x = navigator.geolocation;
          x.getCurrentPosition(success, failure);

          function success(position) {
            
            myLat = position.coords.latitude;
            myLong = position.coords.longitude;
            
            updateMapInfo();
            //$("#map").show();
           // $(".js-list-items").show();
            //$(".js-weather-list").show();
            //$(".js-back").show();
            getDataFromWeatherApi(myLat, myLong, '', displayWeatherData);

            //map.setCenter(lat: myLat, lng: myLong);
            //$("#lat").html(`<p>Your Latitude is ${myLat}</p>`);
            //$("#lat").show();
            //$("#long").html(`<p>Your Longitude is ${myLong}</p>`);
            //$("#long").show();

            console.log('goodjob');
            $('.loading').hide();
            $("#failure").hide();          
          };

          function failure() {     
            $("#failure").html('<p>Cannot show your location unless you choose allow</p>');
            $("#failure").show();
            $('.loading').hide();
            $(".js-back").show();
          };
        } else {         
          $("#failure").html('<p>Geolocation is not supported by Your browser</p>');
        };
        
}

function handleAnywhereButtonClick() {
  $('.js-location-anywhere').on('click', function(event) {
    //$("#lat").remove();
    //$("#long").remove();
    //$("#failure").hide();
    //$("#long").hide();
    //$("#lat").hide();
    //$(".js-list-items").hide();
    //$(".js-weather-list").hide();

    displayForm();
    //$("#userForm").toggle();
    handleSearchButtonClick();
  });
}

function handleLocationButtonClick() {
  $('.js-location-near-me').on('click', function(event) {
    
    $(".user-input").hide();
    
    getLocation();
    //$(".js-list-items").show();
    //$(".js-weather-list").show();
    //getDataFromWeatherApi(displayWeatherData);
    //updateMapInfo();
    //$('.loading').hide();
    //$('.home-screen').hide();
    //getDataFromApi(displayNearByData);
  });
}


function handleBackButtonClick() {
  $(".js-back").on('click', function(event) {
    $(".js-list-items").hide();
    $(".js-weather-list").hide();
    $("#map").hide();
    $(".user-input").show();
    $(".js-back").hide();
    $(".js-search-form").hide();
    $(".js-error").hide();
    $("#failure").hide();
  });
}


function runApp() {
  //$('.user-input').hide();
  $(".js-back").hide();
  $("#map").hide();
  $('.loading').hide('fast');
  
  handleBackButtonClick();
  handleLocationButtonClick();
  //$("#map").show();
  handleAnywhereButtonClick();
  
  //updateMapInfo();
  //initMap();
  //createMarker();
  //showPosition();
  //handleLocationButtonClick();
}

$(runApp);



