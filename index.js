function getLocation() {
    
        /*navigator.geolocation.getCurrentPosition(function(position){
          $(".js-show-result").html("latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
          console.log(position.coords.latitude);
        });*/
        if (navigator.geolocation) {
          console.log('geolocation');
        }
        console.log('hello');
        let x = navigator.geolocation;
        console.log(x);
        
        x.getCurrentPosition(success, failure);

        function success(position) {
          let myLat = position.coords.latitude;
          let myLong = position.coords.longitude;
          $("#lat").html(myLat);
          $("#long").html(myLong);
          console.log('goodjob');
          $("#failure").html('<p>worked</p>') 
        }
        
        function failure() {
          $("#failure").html('<p>Failed</p>')
        }
        
        $(".js-show-result").html('<p>Im here</p>');
    
}
/*function showPosition(position) {
    $('.js-show-result').html(`<p>Latitude:
    <br>Longitude: </p>`);
    //console.log(`${position.coords.latitude}`); 
}

function handleLocationButtonClick() {
  $('.js-location').on('click', function(event) {
    getLocation();
  });
}*/

function runApp() {
  //success();
  getLocation();
  
  //showPosition();
  //handleLocationButtonClick();
}

$(runApp);

//$(getLocation);

