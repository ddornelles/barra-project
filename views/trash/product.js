
function anotherMap() {
  // Initialize the map
  const map = new google.maps.Map(document.getElementById('newmap'), {
    zoom: 15,
    center: new google.maps.LatLng(-22.9732303, -43.2033079),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  });

  
  let myMarker = new google.maps.Marker({
    position: new google.maps.LatLng(-22.9732303, -43.2033079),
    draggable: true,
  });

  google.maps.event.addListener(myMarker, 'dragend', (evt) => {
    document.getElementById('latitude').value = `${evt.latLng.lat()}`;
    document.getElementById('longitude').value = `${evt.latLng.lng()}`;
  });

  map.setCenter(myMarker.position);
  myMarker.setMap(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const user_location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // Center map with user location
      map.setCenter(user_location);

      // Add a marker for your user location
      myMarker = new google.maps.Marker({
        position: {
          lat: user_location.lat,
          lng: user_location.lng,
        },
        map: map,
        draggable:true,
        title: "You are here.",
      });
    }, () => {
      console.log('Error in the geolocation service.');
    });
  } else {
    console.log('Browser does not support geolocation.');
  }
}

window.onload = () => {
  anotherMap();
};
