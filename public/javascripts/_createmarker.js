function searchMap() {
  // Initialize the map
  const map = new google.maps.Map(document.getElementById('searchmap'), {
    center: {lat: -22.9732303, lng: -43.2033079},
    zoom: 14,
    mapTypeId: 'roadmap',
  });

  // Create the search box and link it to the UI element.
  const input = document.getElementById('search-home');
  const searchBox = new google.maps.places.SearchBox(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function () {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

  const getBarracas = () => {
    axios.get('/api')
      .then((response) => {
        placeBarracas(response.data.barracas);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const placeBarracas = (barracas) => {
    barracas.forEach((barraca) => {
      const center = {
        lat: barraca.location.coordinates[1],
        lng: barraca.location.coordinates[0],
      };
      const pin = new google.maps.Marker({
        position: center,
        map,
        title: barraca.name,
      });
    });
  };

  getBarracas();

}

searchMap();
