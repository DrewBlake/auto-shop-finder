let map;
let infowindow;
const WEATHER_SEARCH_URL = 'https://api.openweathermap.org/data/2.5/find';

function initMap() {
  let local = {lat: 33.608, lng: -84.361};

  map = new google.maps.Map(document.getElementById('map'), {
    center: local,
    zoom: 15
  });

  infowindow = new google.maps.InfoWindow();

   let request = {
    location: local,
    radius: '500',
    query: 'car shop'
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    let shopList = '';
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i]);
      shopList += `<li>${results[i].name} ${results[i].formatted_address}</li>`;
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

function getDataFromWeatherApi(callback2) {
  const query = {
    q: 'Atlanta',
    units: 'imperial',
    appid: '0c71fc03b2b136bb5a5a20de50504d84',   
  }
  $.getJSON(WEATHER_SEARCH_URL, query, callback2);
}

function displayWeatherData (data) {
  const results = [`${data.list[0].main.temp} degrees F, and ${data.list[0].main.humidity} % humidity`];
  console.log(results);
  $('.js-weather-list').html(results);
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
    $("#userInput").html(`<p>The location you entered is ${query}</p>`);
    queryTarget.val("");
    //$('.home-screen').hide();   
 });
}

function getLocation() {
        if (navigator.geolocation) {
          $('.loading').show();
          const x = navigator.geolocation;
          x.getCurrentPosition(success, failure);

          function success(position) {
            
            let myLat = position.coords.latitude;
            let myLong = position.coords.longitude;
            
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
    displayForm();
    handleSearchButtonClick();
  });
}

function handleLocationButtonClick() {
  $('.js-location-near-me').on('click', function(event) {
    $("#long").hide();
    $("#lat").hide();
    getLocation();
    //$('.loading').hide();
    //$('.home-screen').hide();
    //getDataFromApi(displayNearByData);
  });
}





function runApp() {
  $('.user-input').hide();
  //$('main').hide();
  //$("#map").hide();
  $('.loading').hide('fast');
  getDataFromWeatherApi(displayWeatherData);
  handleLocationButtonClick();
  //$("#map").show();
  handleAnywhereButtonClick();
  //initMap();
  //createMarker();
  //showPosition();
  //handleLocationButtonClick();
}

$(runApp);



